using System.Collections.Generic;
using System.Linq;
using System.Threading;
using BudgetApp.Backend.Dto;
using BudgetApp.Backend.Dto.Auth;
using MongoDB.Driver;
using Exception = System.Exception;

namespace BudgetApp.Backend.Api.Services
{
    public static class MongoInsertContext
    {
        private const string InsertMethodName = "InsertOne";
        private const int InsertMethodParameterCount = 3;
        private const string ValidateInsertMethodName = "ValidateInsert";

        public static RequestReport PerformInsertRequest(object collection, string requestedType, object dto)
        {
            var insertMethod = collection?.GetType().GetMethods().FirstOrDefault(itm =>
                itm.Name == InsertMethodName && itm.GetParameters().Length == InsertMethodParameterCount);
            insertMethod.Invoke(collection,
                new[]
                {
                    dto, new InsertOneOptions() {BypassDocumentValidation = false}, default(CancellationToken)
                });
            return SuccessfulInsert(requestedType);
        }

        private static RequestReport SuccessfulInsert(string requestedType)
        {
            return new()
            {
                IsSuccess = true,
                RowsAffected = 1,
                Messages = new()
                {
                    new()
                    {
                        ErrorCode = ApiErrorCode.RequestCompleted,
                        Level = IncidentLevel.Information,
                        MessageText = "Item was inserted",
                        Parameters = new() {requestedType}
                    }
                }
            };
        }
    }
}