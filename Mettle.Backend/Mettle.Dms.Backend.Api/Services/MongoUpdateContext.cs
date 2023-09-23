using System;
using System.Linq;
using System.Threading;
using MongoDB.Bson;
using MongoDB.Driver;

namespace BudgetApp.Backend.Api.Services
{
    public static class MongoUpdateContext
    {
        private const string UpdateOneMethodName = "UpdateOne";
        private const int UpdateOneParamaterCount = 4;

        public static UpdateResult? PerformUpdateOneResult(object collection, Type dtoType, string filterQuery,
            string updateQuery)
        {
            var updateOneMethod = collection?.GetType().GetMethods()
                .FirstOrDefault(itm =>
                    itm.Name == UpdateOneMethodName && itm.GetParameters().Length == UpdateOneParamaterCount);

            var filterDefinition = CreateBsonDocument(dtoType, filterQuery, typeof(BsonDocumentFilterDefinition<>));
            var updateDefinition = CreateBsonDocument(dtoType, updateQuery, typeof(BsonDocumentUpdateDefinition<>));

            var result = updateOneMethod.Invoke(collection,
                new[]
                {
                    filterDefinition, updateDefinition, new UpdateOptions() {BypassDocumentValidation = false, IsUpsert = false},
                    default(CancellationToken)
                });

            if (result is UpdateResult deletedResult)
            {
                return deletedResult;
            }

            return null;
        }

        private static object CreateBsonDocument(Type dtoType, string query, Type bsonDocumentType)
        {
            Type[] typeArgs = {dtoType};
            var fd = bsonDocumentType.MakeGenericType(typeArgs);
            var instance = Activator.CreateInstance(fd, BsonDocument.Parse(query));
            return instance;
        }
    }
}