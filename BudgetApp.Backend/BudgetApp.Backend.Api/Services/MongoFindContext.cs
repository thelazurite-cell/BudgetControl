using System;
using System.Linq;
using System.Threading;
using BudgetApp.Backend.Api.Configuration;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;

namespace BudgetApp.Backend.Api.Services
{
    public static class MongoFindContext
    {
        private const string FindMethodName = "FindSync";
        private const int FindMethodParameterCount = 3;

        public static object PerformFindRequest(object collection, Type dtoType, string query)
        {
            var fetchMethod = collection?.GetType().GetMethods()
                .FirstOrDefault(itm =>
                    itm.Name == FindMethodName && itm.GetParameters().Length == FindMethodParameterCount);
            var fdInstance = InsertFindQuery(dtoType, query);
            var genericFetch = fetchMethod.MakeGenericMethod(dtoType);
            var result = (genericFetch.Invoke(collection, new[] {fdInstance, null, default(CancellationToken)}));
            return result;
        }

        private static object InsertFindQuery(Type dtoType, string query)
        {
            var filterDefinitionType = typeof(BsonDocumentFilterDefinition<>);
            Type[] typeArgs = {dtoType};
            var fd = filterDefinitionType.MakeGenericType(typeArgs);
            var fdInstance = Activator.CreateInstance(fd, BsonDocument.Parse(query));
            return fdInstance;
        }
    }
}