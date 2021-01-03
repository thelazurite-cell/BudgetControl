using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text.Json;
using System.Threading.Tasks;
using BudgetApp.Backend.Api.Configuration;
using BudgetApp.Backend.Api.Controllers.BaseClasses;
using BudgetApp.Backend.Api.Services;
using BudgetApp.Backend.Dto;
using BudgetApp.Backend.Dto.Auth;
using BudgetApp.Backend.Dto.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Exception = System.Exception;

namespace BudgetApp.Backend.Api.Controllers
{
    [ApiController]
    public class InsertController : DataController
    {
        private readonly ILogger<InsertController> _logger;
        private MongoManager _manager;

        public InsertController(ILogger<InsertController> logger, IOptions<ApplicationSettings> options) : base(options)
        {
            _logger = logger;
            _manager = new MongoManager(options);
        }

        [HttpPut]
        [Route("{requestedType}/insert")]
        public async Task<HttpResponse> Insert(string requestedType)
        {
            var dtoType = _manager.GetDtoType(requestedType);
            if (dtoType == null)
            {
                return await TypeNotAvailable(requestedType);
            }

            var requestBody = await GetRequestBody();
            if (string.IsNullOrWhiteSpace(requestBody))
            {
                return await SerializedObjectResponse(
                    RequestReportGenerator.ErrorReadingDataReport(requestedType, requestBody));
            }

            var deserialize = GetJsonDeserializeForDto(dtoType);
            var deserializedObject = deserialize.Invoke(null, new object[] {requestBody, GetJsonSerializerOptions()});
            if (IsDtoType(deserializedObject))
            {
                var res = Manager.Insert(dtoType.Name, dtoType, deserializedObject);
                return await SerializedObjectResponse(res);
            }

            return await SerializedObjectResponse(
                RequestReportGenerator.ErrorReadingDataReport(requestedType, requestBody));
        }

        [HttpPut]
        [Route("{requestedType}/insertMany")]
        public async Task<HttpResponse> InsertMany(string requestedType)
        {
            var dtoType = _manager.GetDtoType(requestedType);
            if (dtoType == null)
            {
                return await TypeNotAvailable(requestedType);
            }

            var genericListType = typeof(List<>);
            var listOfDto = genericListType.MakeGenericType(dtoType);
            var requestBody = await GetRequestBody();
            if (string.IsNullOrWhiteSpace(requestBody))
            {
                return await SerializedObjectResponse(
                    RequestReportGenerator.ErrorReadingDataReport(requestedType, requestBody));
            }

            var deserialize = GetJsonDeserializeForDto(listOfDto);
            var deserializedObject = deserialize.Invoke(null, new object[] {requestBody, GetJsonSerializerOptions()});
            RequestReport? report = null;
            if (deserializedObject is not IList list)
                return await SerializedObjectResponse(report ??
                                                      RequestReportGenerator.ErrorReadingDataReport(requestedType,
                                                          requestBody));
            report = AttemptInsertArrayItems(list, dtoType);

            return await SerializedObjectResponse(report);
        }

        private RequestReport AttemptInsertArrayItems(IList list, Type dtoType)
        {
            RequestReport report;
            report = new RequestReport();
            report.IsSuccess = true;
            foreach (var itm in list)
            {
                try
                {
                    if (ArrayItemIsNotDtoType(itm, report)) continue;
                    AttemptToInsertArrayItem(dtoType, itm, report);
                }
                catch (System.Exception e)
                {
                    AddExceptionErrors(dtoType, e, report);
                }
            }

            return report;
        }

        private static void AddExceptionErrors(Type dtoType, Exception e, RequestReport report)
        {
            var exceptionReport =
                RequestReportGenerator.ExceptionReport(dtoType.Name, "Error occurred During mass insert",
                    e);
            report.IsSuccess = false;
            report.Messages.AddRange(exceptionReport.Messages);
        }

        private void AttemptToInsertArrayItem(Type dtoType, object itm, RequestReport report)
        {
            var res = Manager.Insert(dtoType.Name, dtoType, itm);
            report.Messages.AddRange(res.Messages);
            if (!res.IsSuccess)
            {
                report.IsSuccess = false;
            }
        }

        private static bool ArrayItemIsNotDtoType(object itm, RequestReport report)
        {
            if (IsDtoType(itm)) return false;
            report.Messages.Add(new Message()
            {
                ErrorCode = ApiErrorCode.InvalidDataType,
                Level = IncidentLevel.Error,
                MessageText = "Was not an expected type",
                Parameters = new List<string>()
                {
                    itm.GetType().Name
                }
            });
            return true;

        }
    }
}