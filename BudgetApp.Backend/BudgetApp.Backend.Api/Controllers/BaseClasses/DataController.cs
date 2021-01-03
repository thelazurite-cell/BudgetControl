using System;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using BudgetApp.Backend.Api.Configuration;
using BudgetApp.Backend.Api.Services;
using BudgetApp.Backend.Dto;
using BudgetApp.Backend.Dto.Auth;
using BudgetApp.Backend.Dto.Converters;
using BudgetApp.Backend.Dto.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace BudgetApp.Backend.Api.Controllers.BaseClasses
{
    public abstract class DataController : ControllerBase
    {
        private const string DeserializeMethodName = "Deserialize";
        private const int DeserializeMethodParameterCount = 2;
        protected IOptions<ApplicationSettings> Options { get; set; }
        protected MongoManager Manager { get; set; }

        public DataController(IOptions<ApplicationSettings> options)
        {
            this.Options = options;
            this.Manager = new MongoManager(options);
        }

        protected async Task<HttpResponse> SerializedObjectResponse(object responseObject, int statusCode = 200)
        {
            var jsonOptions = GetJsonSerializerOptions();
            if (responseObject is RequestReport report)
            {
                this.Response.StatusCode = report.IsInternalError ? 500 : statusCode;
            }
            else
            {
                this.Response.StatusCode = statusCode;
            }

            //this.Response.Headers.Add("Access-Control-Allow-Origin", Options.Value.General.UserApplication);
            this.Response.ContentType = "application/json";
            var serialize = JsonSerializer.Serialize(responseObject, jsonOptions);
            this.Response.Headers.Add("Content-Length", serialize.Length.ToString());
            await this.Response.Body.WriteAsync(
                Encoding.UTF8.GetBytes(serialize));
            return this.Response;
        }

        protected virtual JsonSerializerOptions GetJsonSerializerOptions()
        {
            var jsonOptions = new JsonSerializerOptions {WriteIndented = true};
            jsonOptions.Converters.Add(new DecimalConverter());
            jsonOptions.Converters.Add(new FloatConverter());
            jsonOptions.Converters.Add(new DoubleConverter());
            return jsonOptions;
        }

        protected async Task<string> GetRequestBody()
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

        protected static bool IsDtoType(object? deserializedObject)
        {
            var baseType = deserializedObject?.GetType().BaseType ?? typeof(string);
            return baseType.Name.Equals(nameof(DataTransferObject)) || baseType.Name.Equals(nameof(ExpenseDto));
        }

        protected static MethodInfo GetJsonDeserializeForDto(Type dtoType)
        {
            var deserializerMethod = typeof(JsonSerializer).GetMethods().FirstOrDefault(itm =>
            {
                if (itm.Name != DeserializeMethodName) return false;
                var parameters = itm.GetParameters();
                if (parameters.Length == DeserializeMethodParameterCount)
                {
                    return parameters[0].ParameterType == typeof(string);
                }

                return false;
            });
            var genericMethod = deserializerMethod.MakeGenericMethod(dtoType);
            return genericMethod;
        }
    }
}