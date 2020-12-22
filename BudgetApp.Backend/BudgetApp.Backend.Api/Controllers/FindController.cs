using System;
using System.Collections.Generic;
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
        [Route("{type}/find")]
        public async Task<HttpResponse> Get(string type)
        {
            var period = new Period();
            var asm = GetDtoType(type);
            if (asm == null)
            {
                return await TypeNotFound(type);
            };
            var query = "{}";
            var client = new MongoClient(_options.Value.Database.Host);
            var collection = GetCollection(type, client.GetDatabase(_options.Value.Database.DatabaseName), asm);
            var enumerable = ConvertResponseToList(asm, PerformFindRequest(collection, asm, query));
            var jsonOptions = new JsonSerializerOptions();
            jsonOptions.WriteIndented = true;
            var response = new HttpResponseMessage();
            this.Response.StatusCode = 200;
            this.Response.ContentType = "application/json";
            await this.Response.Body.WriteAsync(Encoding.UTF8.GetBytes(JsonSerializer.Serialize(enumerable)));
            return this.Response; 
        }

        private async Task<HttpResponse> TypeNotFound(String type)
        {
            this.Response.StatusCode = 400;
            await this.Response.BodyWriter.WriteAsync(Encoding.UTF8.GetBytes("Could not find a type of {type}"));
            return this.Response;
        }

        private static Type GetDtoType(String type)
        {
            var assembly = AppDomain.CurrentDomain.GetAssemblies()
                .FirstOrDefault(itm => itm.FullName.Contains("BudgetApp.Backend.Dto"));
            var asm = assembly.GetTypes()
                .FirstOrDefault(itm => itm.Name.ToLower().Equals(type.ToLower()));
            return asm;
        }

        private static Object ConvertResponseToList(Type asm, Object result)
        {
            MethodInfo toListMethod = typeof(IAsyncCursorExtensions).GetMethod("ToList");
            var constructedToList = toListMethod.MakeGenericMethod(asm);
            var enumerable = constructedToList.Invoke(null, new object[] {result, default(CancellationToken)});
            return enumerable;
        }

        private static Object PerformFindRequest(Object collection, Type asm, String query)
        {
            var fetchMethod = collection?.GetType().GetMethods()
                .FirstOrDefault(itm => itm.Name == "FindSync" && itm.GetParameters().Length == 3);
            var fdInstance = InsertFindQuery(asm, query);
            var genericFetch = fetchMethod.MakeGenericMethod(asm);
            var result = (genericFetch.Invoke(collection, new Object[] {fdInstance, null, default(CancellationToken)}));
            return result;
        }

        private static Object InsertFindQuery(Type asm, String query)
        {
            var filterDefinitionType = typeof(BsonDocumentFilterDefinition<>);
            Type[] typeArgs = {asm};
            var fd = filterDefinitionType.MakeGenericType(typeArgs);
            var fdInstance = Activator.CreateInstance(fd, new object?[] {BsonDocument.Parse(query)});
            return fdInstance;
        }

        private static Object GetCollection(String type, IMongoDatabase db, Type asm)
        {
            var info = db.GetType().GetMethod(nameof(db.GetCollection));
            var generic = info.MakeGenericMethod(asm);
            var collection = generic.Invoke(db, new object[] {type, new MongoCollectionSettings()});
            return collection;
        }
    }
}
