using System.IO;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using BudgetApp.Backend.Api.Configuration;
using BudgetApp.Backend.Dto;
using BudgetApp.Backend.Dto.Auth;
using BudgetApp.Backend.Dto.Converters;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace BudgetApp.Backend.Api.Controllers.BaseClasses
{
    public abstract class DataController : ControllerBase
    {
        protected IOptions<ApplicationSettings> Options { get; set; }

        public DataController(IOptions<ApplicationSettings> options)
        {
            this.Options = options;
        }

        protected async Task<HttpResponse> SerializedObjectResponse(object responseObject, int statusCode = 200)
        {
            var jsonOptions = GetJsonSerializerOptions();
            this.Response.StatusCode = statusCode;
            this.Response.ContentType = "application/json";
            await this.Response.Body.WriteAsync(
                Encoding.UTF8.GetBytes(JsonSerializer.Serialize(responseObject, jsonOptions)));
            return this.Response;
        }

        protected virtual JsonSerializerOptions GetJsonSerializerOptions()
        {
            var jsonOptions = new JsonSerializerOptions {WriteIndented = true};
            return jsonOptions;
        }

        protected async Task<string> GetRequestBodyJson()
        {
            using var sr = new StreamReader(this.Request.Body);
            var body = await sr.ReadToEndAsync();
            return body;
        }

        protected async Task<HttpResponse> TypeNotAvailable(string type)
        {
            this.Response.StatusCode = 400;
            this.Response.ContentType = "application/json";
            await this.Response.BodyWriter.WriteAsync(
                Encoding.UTF8.GetBytes(JsonSerializer.Serialize(GenerateInvalidTypeReport(type))));
            return this.Response;
        }

        private static RequestReport GenerateInvalidTypeReport(string type)
        {
            var report = new RequestReport {IsSuccess = false};
            report.Messages.Add(new Message
            {
                ErrorCode = ApiErrorCode.InvalidDataType,
                Level = IncidentLevel.Error,
                MessageText = "The requested type is invalid",
                Parameters = {type}
            });
            return report;
        }
    }
}