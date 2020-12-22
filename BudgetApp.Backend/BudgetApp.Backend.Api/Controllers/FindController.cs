using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Text;
using System.Text.Json;
using System.Text.Unicode;
using System.Threading;
using System.Threading.Tasks;
using BudgetApp.Backend.Api.Configuration;
using BudgetApp.Backend.Dto;
using BudgetApp.Backend.Dto.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Core.Operations;

namespace BudgetApp.Backend.Api.Controllers
{
    [ApiController]
    public class FindController : ControllerBase
    {
        private readonly ILogger<FindController> _logger;
        private IOptions<ApplicationSettings> _options;

        public FindController(ILogger<FindController> logger, IOptions<ApplicationSettings> options)
        {
            _logger = logger;
            _options = options;
        }

        [HttpGet()]
        [Route("{requestedType}/findAll")]
        public async Task<HttpResponse> Get(string requestedType)
        {
            var dtoType = GetDtoType(requestedType);
            if (dtoType == null)
            {
                return await TypeNotFoundResponse(requestedType);
            }

            return await SerializedObjectResponse(GetMongoFindResponse(requestedType, dtoType, "{}"));
        }

        private async Task<HttpResponse> SerializedObjectResponse(Object mongoResponse)
        {
            var jsonOptions = new JsonSerializerOptions {WriteIndented = true};
            this.Response.StatusCode = 200;
            this.Response.ContentType = "application/json";
            await this.Response.Body.WriteAsync(Encoding.UTF8.GetBytes(JsonSerializer.Serialize(mongoResponse, jsonOptions)));
            return this.Response;
        }

        // [HttpPost]
        // [Route("{requestedType}/find")]
        // public async Task<HttpResponse> Find(string requestedType)
        // {
        //     
        // }

        private Object GetMongoFindResponse(String requestedType, Type dtoType, String query)
        {
            var client = new MongoClient(_options.Value.Database.Host);
            var collection = GetCollection(requestedType, client.GetDatabase(_options.Value.Database.DatabaseName), dtoType);
            var mongoResponse = ConvertResponseToList(dtoType, PerformFindRequest(collection, dtoType, query));
            return mongoResponse;
        }

        private async Task<HttpResponse> TypeNotFoundResponse(String type)
        {
            this.Response.StatusCode = 400;
            this.Response.ContentType = "application/json";
            await this.Response.BodyWriter.WriteAsync(Encoding.UTF8.GetBytes(JsonSerializer.Serialize($"Could not find a type of {type}")));
            return this.Response;
        }

        /// <summary>
        /// Gets the DTO type from the expected assembly, if it is not marked with the <see cref="TransferableDataTypeAttribute"/> then we return null
        /// </summary>
        /// <param name="type">The type requested from the client.</param>
        /// <returns>If the dto exists and is marked with the expected attribute, the type is returned. Otherwise the value will be null.</returns>
        private Type? GetDtoType(String type)
        {
            var assemblyLocation = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, this._options.Value.General.DtoDllName);
            var assembly = Assembly.LoadFile(assemblyLocation);
            var dtoType = assembly?.GetTypes()?
                .FirstOrDefault(itm => itm.Name.ToLower().Equals(type.ToLower()));
            var customAttribute = dtoType.GetCustomAttributesData()
                .Any(itm => itm.AttributeType.Name == nameof(TransferableDataTypeAttribute));
            return customAttribute == false ? null : dtoType;
        }

        private static Object ConvertResponseToList(Type dtoType, Object result)
        {
            MethodInfo toListMethod = typeof(IAsyncCursorExtensions).GetMethod("ToList");
            var constructedToList = toListMethod.MakeGenericMethod(dtoType);
            var enumerable = constructedToList.Invoke(null, new[] {result, default(CancellationToken)});
            return enumerable!;
        }

        private static Object PerformFindRequest(Object collection, Type dtoType, String query)
        {
            var fetchMethod = collection?.GetType().GetMethods()
                .FirstOrDefault(itm => itm.Name == "FindSync" && itm.GetParameters().Length == 3);
            var fdInstance = InsertFindQuery(dtoType, query);
            var genericFetch = fetchMethod.MakeGenericMethod(dtoType);
            var result = (genericFetch.Invoke(collection, new[] {fdInstance, null, default(CancellationToken)}));
            return result;
        }

        private static Object InsertFindQuery(Type asm, String query)
        {
            var filterDefinitionType = typeof(BsonDocumentFilterDefinition<>);
            Type[] typeArgs = {asm};
            var fd = filterDefinitionType.MakeGenericType(typeArgs);
            var fdInstance = Activator.CreateInstance(fd, BsonDocument.Parse(query));
            return fdInstance;
        }

        private static Object GetCollection(String type, IMongoDatabase db, Type asm)
        {
            var info = db.GetType().GetMethod(nameof(db.GetCollection));
            var generic = info.MakeGenericMethod(asm);
            var collection = generic.Invoke(db, new Object[] {type, new MongoCollectionSettings()});
            return collection;
        }
    }
}
