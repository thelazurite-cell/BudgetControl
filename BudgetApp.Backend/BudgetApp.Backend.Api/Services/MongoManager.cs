using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.Json.Serialization;
using System.Threading;
using BudgetApp.Backend.Api.Configuration;
using BudgetApp.Backend.Dto;
using BudgetApp.Backend.Dto.Auth;
using BudgetApp.Backend.Dto.Interfaces;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;

namespace BudgetApp.Backend.Api.Services
{
    public class MongoManager
    {
        private IOptions<ApplicationSettings> _options;

        public MongoManager(IOptions<ApplicationSettings> options)
        {
            this._options = options;
        }

        public object Find(string requestedType, Type dtoType, string query)
        {
            try
            {
                var client = new MongoClient(_options.Value.Database.Host);
                var collection = GetCollection(requestedType, client.GetDatabase(_options.Value.Database.DatabaseName),
                    dtoType);
                var mongoResponse =
                    ConvertResponseToList(dtoType, MongoFindContext.PerformFindRequest(collection, dtoType, query));
                return mongoResponse;
            }
            catch (System.Exception e)
            {
                return MongoReportGenerator.ExceptionReport(requestedType,
                    "A problem occurred while trying to find records", e);
            }
        }

        public RequestReport Insert(string requestedType, Type dtoType, object query)
        {
            try
            {
                var client = new MongoClient(_options.Value.Database.Host);
                var collection = GetCollection(requestedType, client.GetDatabase(_options.Value.Database.DatabaseName),
                    dtoType);
                ;
                return MongoInsertContext.PerformInsertRequest(collection, requestedType, query);
            }
            catch (System.Exception e)
            {
                return MongoReportGenerator.ExceptionReport(requestedType,
                    "A problem occurred while trying to insert records", e);
            }
        }

        public RequestReport Update(string requestedType, Type dtoType, string filterQuery, string updateQuery)
        {
            try
            {
                var client = new MongoClient(_options.Value.Database.Host);
                var collection = GetCollection(requestedType, client.GetDatabase(_options.Value.Database.DatabaseName),
                    dtoType);
                var update = MongoUpdateContext.PerformUpdateOneResult(collection, dtoType, filterQuery, updateQuery);

                return MongoReportGenerator.CreateUpdateReport(requestedType, filterQuery, update);
            }
            catch (System.Exception e)
            {
                return MongoReportGenerator.ExceptionReport(requestedType,
                    "A problem occurred while trying to update records", e);
            }
        }

        public RequestReport Delete(string requestedType, Type dtoType, string query)
        {
            try
            {
                var client = new MongoClient(_options.Value.Database.Host);
                var collection = GetCollection(requestedType, client.GetDatabase(_options.Value.Database.DatabaseName),
                    dtoType);
                var delete = MongoDeleteContext.PerformDeleteRequest(collection, dtoType, query);
                return MongoReportGenerator.CreateDeleteReport(requestedType, query, delete);
            }
            catch (System.Exception e)
            {
                return MongoReportGenerator.ExceptionReport(requestedType,
                    "A problem occurred while trying to delete records", e);
            }
        }

        /// <summary>
        /// Gets the DTO type from the expected assembly, if it is not marked with the <see cref="TransferableDataTypeAttribute"/> then we return null
        /// </summary>
        /// <param name="type">The type requested from the client.</param>
        /// <returns>If the dto exists and is marked with the expected attribute, the type is returned. Otherwise the value will be null.</returns>
        public Type? GetDtoType(string type)
        {
            var assemblyLocation = Path.Combine(AppDomain.CurrentDomain.BaseDirectory,
                this._options.Value.General.DtoDllName);
            var assembly = Assembly.LoadFile(assemblyLocation);
            var dtoType = assembly?.GetTypes()?
                .FirstOrDefault(itm => itm.Name.ToLower().Equals(type.ToLower()));
            var customAttribute = dtoType.GetCustomAttributesData()
                .Any(itm => itm.AttributeType.Name == nameof(TransferableDataTypeAttribute));
            return customAttribute == false ? null : dtoType;
        }

        private static object ConvertResponseToList(Type dtoType, object result)
        {
            MethodInfo toListMethod = typeof(IAsyncCursorExtensions).GetMethod("ToList");
            var constructedToList = toListMethod.MakeGenericMethod(dtoType);
            var enumerable = constructedToList.Invoke(null, new[] {result, default(CancellationToken)});
            return enumerable!;
        }

        private static object GetCollection(string type, IMongoDatabase db, Type dtoType)
        {
            var info = db.GetType().GetMethod(nameof(db.GetCollection));
            var generic = info.MakeGenericMethod(dtoType);
            var collection = generic.Invoke(db, new object[] {type, new MongoCollectionSettings()});
            return collection;
        }
    }
}