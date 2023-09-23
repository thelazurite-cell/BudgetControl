using System;
using System.Linq;
using System.Threading;
using MongoDB.Bson;
using MongoDB.Driver;

namespace BudgetApp.Backend.Api.Services
{
    public static class MongoDeleteContext
    {
        private const string DeleteMethodName = "DeleteOne";
        private const int DeleteMethodParameterCount = 2;

        public static DeleteResult? PerformDeleteRequest(object collection, Type dtoType, string query)
        {
            var deleteMethod = collection?.GetType().GetMethods()
                .FirstOrDefault(itm =>
                    itm.Name == DeleteMethodName && itm.GetParameters().Length == DeleteMethodParameterCount);

            var fdInstance = CreateFilterDefinition(dtoType, query);
            var result = deleteMethod.Invoke(collection, new[] {fdInstance, default(CancellationToken)});

            if (result is DeleteResult deletedResult)
            {
                return deletedResult;
            }

            return null;
        }

        private static object CreateFilterDefinition(Type dtoType, string query)
        {
            var filterDefinitionType = typeof(BsonDocumentFilterDefinition<>);
            Type[] typeArgs = {dtoType};
            var fd = filterDefinitionType.MakeGenericType(typeArgs);
            var fdInstance = Activator.CreateInstance(fd, BsonDocument.Parse(query));
            return fdInstance;
        }
    }
}