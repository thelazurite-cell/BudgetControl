using System.Reflection;
using System.Text;
using System.Text.Json;
using BudgetApp.Backend.Api.Configuration;
using BudgetApp.Backend.Api.Services;
using BudgetApp.Backend.Dto;
using BudgetApp.Backend.Dto.Auth;
using BudgetApp.Backend.Dto.Converters;
using BudgetApp.Backend.Dto.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace BudgetApp.Backend.Api.Controllers.BaseClasses
{
    /// <summary>
    /// The <see cref="DataController"/> class. Used by controllers interacting with the data store.
    /// </summary>
    public abstract class DataController : ControllerBase
    {
        private const string DeserializeMethodName = "Deserialize";
        private const int DeserializeMethodParameterCount = 2;

        /// <summary>
        /// Gets or sets the application settings, containing details on how to connect to the database
        /// </summary>
        protected IOptions<ApplicationSettings> Options { get; set; }

        /// <summary>
        /// Gets or sets the mongo manager, responsible for interacting with the data store.
        /// </summary>
        protected MongoManager Manager { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="DataController"/> class.
        /// </summary>
        /// <param name="options"></param>
        protected DataController(IOptions<ApplicationSettings> options)
        {
            this.Options = options;
            this.Manager = new MongoManager(options);
        }

        /// <summary>
        /// Creates a serialized JSON <see cref="HttpResponse"/> with the given object and status code.
        /// </summary>
        /// <param name="responseObject">The object that will be serialized and used as the response body</param>
        /// <param name="statusCode">The response status code to be returned to the user.</param>
        /// <returns>The <see cref="HttpResponse"/> denoting the result of an operation</returns>
        protected async Task SerializedObjectResponse(object responseObject, int statusCode = 200)
        {
            // IActionResult statusCodeResult;
            if (responseObject is RequestReport report)
            {
                this.Request.HttpContext.Response.StatusCode =
                    report.IsInternalError ? 500 : !report.IsSuccess ? 400 : statusCode;
            }
            else
            {
                this.Request.HttpContext.Response.StatusCode = statusCode;
            }

            var jsonOptions = GetJsonSerializerOptions();
            var serialize = SerializeAndAddHeaders(responseObject, jsonOptions);
            await this.Request.HttpContext.Response.Body.WriteAsync(
                Encoding.UTF8.GetBytes(serialize));
            await this.Request.HttpContext.Response.CompleteAsync();
        }

        /// <summary>
        /// Gets JSON serialize/deserialize options
        /// </summary>
        /// <returns>The JSON Serializer options</returns>
        protected virtual JsonSerializerOptions GetJsonSerializerOptions()
        {
            var jsonOptions = new JsonSerializerOptions {WriteIndented = true};
            jsonOptions.Converters.Add(new DecimalConverter());
            jsonOptions.Converters.Add(new FloatConverter());
            jsonOptions.Converters.Add(new DoubleConverter());
            jsonOptions.Converters.Add(new DateTimeConverter());
            return jsonOptions;
        }

        /// <summary>
        /// Gets the request body as a string
        /// </summary>
        /// <returns>The string representation of a request body</returns>
        protected async Task<string> GetRequestBody()
        {
            using var sr = new StreamReader(this.Request.Body);
            var body = await sr.ReadToEndAsync();
            return body;
        }

        /// <summary>
        /// Generates a bad request when the user has attempted to use an invalid type. For the user to be able to request an operation against a DTO it must have a
        /// <see cref="TransferableDataTypeAttribute"/> attached to it, otherwise the check will fail.
        /// </summary>
        /// <param name="type">The type that failed</param>
        /// <returns>The <see cref="HttpResponse"/> denoting failure.</returns>
        protected async Task TypeNotAvailable(string type)
        {
            this.Request.HttpContext.Response.StatusCode = 400;
            this.Request.HttpContext.Response.ContentType = "application/json";
            await this.Response.BodyWriter.WriteAsync(
                Encoding.UTF8.GetBytes(JsonSerializer.Serialize(GenerateInvalidTypeReport(type))));
           }

        /// <summary>
        /// Checks whether the type is a <see cref="DataTransferObject"/> or a <see cref="ExpenseDto"/>
        /// </summary>
        /// <param name="deserializedObject">the object to check</param>
        /// <returns>A boolean indicating whether it was a DTO.</returns>
        protected static bool IsDtoType(object? deserializedObject)
        {
            var baseType = deserializedObject?.GetType().BaseType ?? typeof(string);
            return baseType.Name.Equals(nameof(DataTransferObject)) || baseType.Name.Equals(nameof(ExpenseDto));
        }

        /// <summary>
        /// Gets a serializer for a dynamic type being passed from a request.
        /// </summary>
        /// <param name="dto">the dto to get a serializer for</param>
        /// <returns>The JSON serializer</returns>
        protected static MethodInfo GetJsonDeserializeForDto(Type dto)
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
            var genericMethod = deserializerMethod.MakeGenericMethod(dto);
            return genericMethod;
        }

        /// <summary>
        /// Generates a <see cref="RequestReport"/> when the expected type was not marked with a <see cref="TransferableDataTypeAttribute"/>
        /// </summary>
        /// <param name="type">the type the report is being generated for</param>
        /// <returns>the <see cref="RequestReport"/></returns>
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

        /// <summary>
        /// Serializes the data for a request, and adds required header information.
        /// </summary>
        /// <param name="responseObject">The object to serialize</param>
        /// <param name="jsonOptions">the JSON options to use</param>
        /// <returns>The serialized object.</returns>
        private string SerializeAndAddHeaders(object responseObject, JsonSerializerOptions jsonOptions)
        {
            this.Request.HttpContext.Response.ContentType = "application/json";
            var serialize = JsonSerializer.Serialize(responseObject, jsonOptions);
            this.Request.HttpContext.Response.Headers.Add("Content-Length", serialize.Length.ToString());
            return serialize;
        }
    }
}