using System;
using System.Collections.Generic;
using BudgetApp.Backend.Dto;
using BudgetApp.Backend.Dto.Auth;
using BudgetApp.Backend.Dto.Interfaces;
using MongoDB.Driver;

namespace BudgetApp.Backend.Api.Services
{
    public static class MongoReportGenerator
    {
        public static RequestReport CreateDeleteReport(string requestedType, string query, DeleteResult? delete)
        {
            var report = new RequestReport();
            if (delete?.IsAcknowledged ?? false)
            {
                report.RowsAffected = unchecked((int) delete.DeletedCount);
                report.IsSuccess = true;
                if (report.RowsAffected > 0)
                {
                    report.Messages.Add(new Message
                    {
                        Level = IncidentLevel.Information,
                        ErrorCode = ApiErrorCode.RequestCompleted,
                        MessageText = "Item was deleted successfully",
                        Parameters = {requestedType}
                    });
                }
                else
                {
                    report.Messages.Add(new Message
                    {
                        Level = IncidentLevel.Warning,
                        ErrorCode = ApiErrorCode.NoResultsReturned,
                        MessageText = "No items were deleted. There was no matching item.",
                        Parameters = {requestedType, query}
                    });
                }
            }
            else
            {
                report.Messages.Add(new Message
                {
                    Level = IncidentLevel.Error,
                    ErrorCode = ApiErrorCode.RequestNotAcknowledged,
                    MessageText = "Request was not acknowledged",
                    Parameters = {query}
                });
            }

            return report;
        }

        public static RequestReport ErrorReadingDataReport(string requestedType, string requestBody)
        {
            return new()
            {
                IsSuccess = false,
                Messages = new List<Message>
                {
                    new()
                    {
                        ErrorCode = ApiErrorCode.UnableToReadDataProvided,
                        Level = IncidentLevel.Error,
                        MessageText = "Unable to convert the provided data",
                        Parameters = new List<string>
                        {
                            requestedType,
                            requestBody
                        }
                    }
                }
            };
        }
        public static RequestReport CreateInsertReport(string requestedType, object dto, object insert)
        {
            throw new NotImplementedException();
        }

        public static RequestReport CreateUpdateReport(string requestedType, string query, UpdateResult? update)
        {
            var report = new RequestReport();
            if (update?.IsAcknowledged ?? false)
            {
                report.RowsAffected = unchecked((int) update.ModifiedCount);
                report.IsSuccess = true;
                if (report.RowsAffected > 0)
                {
                    report.Messages.Add(new Message
                    {
                        Level = IncidentLevel.Information,
                        ErrorCode = ApiErrorCode.RequestCompleted,
                        MessageText = "Item(s) updated successfully",
                        Parameters = {requestedType}
                    });
                }
                else
                {
                    report.Messages.Add(new Message
                    {
                        Level = IncidentLevel.Warning,
                        ErrorCode = ApiErrorCode.NoResultsReturned,
                        MessageText = "No items were updated. There was no matching item.",
                        Parameters = {requestedType, query}
                    });
                }
            }
            else
            {
                report.Messages.Add(new Message
                {
                    Level = IncidentLevel.Error,
                    ErrorCode = ApiErrorCode.RequestNotAcknowledged,
                    MessageText = "Request was not acknowledged",
                    Parameters = {query}
                });
            }

            return report;
        }

        public static RequestReport ExceptionReport(string requestedType, string messageText, System.Exception e)
        {
            var failedInsert = new RequestReport();
            var message = new Message()
            {
                ErrorCode = ApiErrorCode.UnexpectedError,
                Level = IncidentLevel.Error,
                MessageText = messageText,
                Parameters = new List<string>() {requestedType}
            };
#if DEBUG
            message.Parameters.Add(e.Message);
            var internalException = e.InnerException;
            while (internalException != null)
            {
                message.Parameters.Add(internalException.Message);
                internalException = internalException.InnerException;
            }
#endif
            failedInsert.Messages.Add(message);
            return failedInsert;
        }
    }
}