using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Security.Authentication;
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
                var db = _options.Value.Database;

                var client = new MongoClient(UseDatabaseConnectionSettings(db));
                var collection = GetCollection(requestedType, client.GetDatabase(db.DatabaseName),
                    dtoType);
                var mongoResponse =
                    ConvertResponseToList(dtoType, MongoFindContext.PerformFindRequest(collection, dtoType, query));
                return mongoResponse;
            }
            catch (System.Exception e)
            {
                return RequestReportGenerator.ExceptionReport(requestedType,
                    "A problem occurred while trying to find records", e);
            }
        }

        private static MongoClientSettings UseDatabaseConnectionSettings(DatabaseSettings db)
        {
            var settings = new MongoClientSettings()
            {
                Server = new MongoServerAddress(db.Host, db.Port),
                UseTls = db.UseTls,
                AllowInsecureTls = db.AllowInsecureTls
            };

            if (db.UsesAuthentication)
            {
                var internalIdentity =
                    new MongoInternalIdentity(db.AuthenticationDatabaseName, db.UserName);

                var passwordEvidence = new PasswordEvidence(db.Password);

                settings.Credential = new MongoCredential(db.AuthenticationType,
                    internalIdentity, passwordEvidence);
            }

            return settings;
        }

        public RequestReport Insert(string requestedType, Type dtoType, object query)
        {
            try
            {
                var collection = GetCollection(requestedType, dtoType);
                return MongoInsertContext.PerformInsertRequest(collection, requestedType, query);
            }
            catch (System.Exception e)
            {
                return RequestReportGenerator.ExceptionReport(requestedType,
                    "A problem occurred while trying to insert records", e);
            }
        }

        private object GetCollection(string requestedType, Type dtoType)
        {
            var db = _options.Value.Database;
            var client = new MongoClient(UseDatabaseConnectionSettings(db));
            var collection = GetCollection(requestedType, client.GetDatabase(_options.Value.Database.DatabaseName),
                dtoType);
            return collection;
        }

        public void InsertIncident(Incident incident)
        {
            Insert(incident.GetType().Name, incident.GetType(), incident);
        }

        public RequestReport Update(string requestedType, Type dtoType, string filterQuery, string updateQuery)
        {
            try
            {
                var db = _options.Value.Database;
                var client = new MongoClient(UseDatabaseConnectionSettings(db));
                var collection = GetCollection(requestedType, client.GetDatabase(_options.Value.Database.DatabaseName),
                    dtoType);
                var update = MongoUpdateContext.PerformUpdateOneResult(collection, dtoType, filterQuery, updateQuery);

                return RequestReportGenerator.CreateUpdateReport(requestedType, filterQuery, update);
            }
            catch (System.Exception e)
            {
                return RequestReportGenerator.ExceptionReport(requestedType,
                    "A problem occurred while trying to update records", e);
            }
        }

        public RequestReport Delete(string requestedType, Type dtoType, string query)
        {
            try
            {
                var db = _options.Value.Database;
                var client = new MongoClient(UseDatabaseConnectionSettings(db));
                var collection = GetCollection(requestedType, client.GetDatabase(_options.Value.Database.DatabaseName),
                    dtoType);
                var delete = MongoDeleteContext.PerformDeleteRequest(collection, dtoType, query);
                return RequestReportGenerator.CreateDeleteReport(requestedType, query, delete);
            }
            catch (System.Exception e)
            {
                return RequestReportGenerator.ExceptionReport(requestedType,
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
            var customAttribute = dtoType?.GetCustomAttributesData()
                .Any(itm => itm.AttributeType.Name == nameof(TransferableDataTypeAttribute)) ?? false;
            return customAttribute == false ? null : dtoType;
        }

        public List<Type> Schemas
        {
            get
            {
                var assemblyLocation = Path.Combine(AppDomain.CurrentDomain.BaseDirectory,
                    this._options.Value.General.DtoDllName);
                var assembly = Assembly.LoadFile(assemblyLocation);

                return assembly?.GetTypes()?
                    .Where(itm => itm?.GetCustomAttributesData()?.Any(
                        attrib => attrib.AttributeType.Name == nameof(DataSchema)
                        ) ?? false
                    )?.ToList() ?? new List<Type>();

            }
        }

        private static object ConvertResponseToList(Type dtoType, object result)
        {
            MethodInfo toListMethod = typeof(IAsyncCursorExtensions).GetMethod("ToList");
            var constructedToList = toListMethod.MakeGenericMethod(dtoType);
            var enumerable = constructedToList.Invoke(null, new[] { result, default(CancellationToken) });
            return enumerable!;
        }

        private static object GetCollection(string type, IMongoDatabase db, Type dtoType)
        {
            var info = db.GetType().GetMethod(nameof(db.GetCollection));
            var generic = info.MakeGenericMethod(dtoType);
            var collection = generic.Invoke(db, new object[] { type, new MongoCollectionSettings() });
            return collection;
        }
    }
}