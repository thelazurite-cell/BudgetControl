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
    /// <summary>
    /// The <see cref="InsertController"/>. Responsible for inserting documents into collections.
    /// </summary>
    [ApiController]
    public class InsertController : DataController
    {
        private readonly ILogger<InsertController> _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="InsertController"/> class.
        /// </summary>
        /// <param name="logger">the controller's logger</param>
        /// <param name="options">the application settings</param>
        public InsertController(ILogger<InsertController> logger, IOptions<ApplicationSettings> options) : base(options)
        {
            _logger = logger;
        }

        /// <summary>
        /// Inserts a single item, with the request body containing information on what to insert.
        /// </summary>
        /// <param name="requestedType">the type/collection to insert into</param>
        /// <returns>a <see cref="HttpResponse"/> denoting whether the operation was successful</returns>
        [HttpPut]
        [Route("{requestedType}/insert")]
        public async Task Insert(string requestedType)
        {
            var dtoType = Manager.GetDtoType(requestedType);
            if (dtoType == null)
            {
                await TypeNotAvailable(requestedType);
                return;
            }

            var requestBody = await GetRequestBody();
            if (string.IsNullOrWhiteSpace(requestBody))
            {
                try
                {
                    await SerializedObjectResponse(
                        RequestReportGenerator.ErrorReadingDataReport(requestedType, requestBody));
                    return;
                }
                catch (Exception ex)
                {
                    await SerializedObjectResponse(RequestReportGenerator.ExceptionReport(requestedType, requestBody, ex));
                }
            }

            var deserialize = GetJsonDeserializeForDto(dtoType);
            var deserializedObject = deserialize.Invoke(null, new object[] { requestBody, GetJsonSerializerOptions() });
            if (IsDtoType(deserializedObject))
            {
                var res = Manager.Insert(dtoType.Name, dtoType, deserializedObject);
                await SerializedObjectResponse(res);
                return;
            }

            await SerializedObjectResponse(
                RequestReportGenerator.ErrorReadingDataReport(requestedType, requestBody));
        }

        /// <summary>
        /// Inserts multiple items into the given collection. the items to insert are contained within the request body.
        /// </summary>
        /// <param name="requestedType">the type of item/collection to insert</param>
        /// <returns>a <see cref="HttpResponse"/> denoting whether the operation was successful</returns>
        [HttpPut]
        [Route("{requestedType}/insertMany")]
        public async Task InsertMany(string requestedType)
        {
            var dtoType = Manager.GetDtoType(requestedType);
            if (dtoType == null)
            {
                await TypeNotAvailable(requestedType);
                return;
            }

            var genericListType = typeof(List<>);
            var listOfDto = genericListType.MakeGenericType(dtoType);
            var requestBody = await GetRequestBody();
            if (string.IsNullOrWhiteSpace(requestBody))
            {
                await SerializedObjectResponse(
                    RequestReportGenerator.ErrorReadingDataReport(requestedType, requestBody));
                return;
            }

            var deserialize = GetJsonDeserializeForDto(listOfDto);
            try
            {
                var deserializedObject = deserialize.Invoke(null, new object[] { requestBody, GetJsonSerializerOptions() });

                RequestReport? report = null;
                if (deserializedObject is not IList list)
                {
                    await SerializedObjectResponse(report ??
                                                RequestReportGenerator.ErrorReadingDataReport(requestedType,
                                                    requestBody));
                    return;
                }
                report = AttemptInsertArrayItems(list, dtoType);

                await SerializedObjectResponse(report);
            }
            catch (Exception e)
            {
                await SerializedObjectResponse(RequestReportGenerator.ExceptionReport(requestedType, "Error Performing Request", e));
            }
        }

        private RequestReport AttemptInsertArrayItems(IList list, Type dtoType)
        {
            RequestReport report;
            report = new RequestReport();
            report.IsSuccess = true;
            report.RowsAffected = 0;
            foreach (var itm in list)
            {
                try
                {
                    if (ArrayItemIsNotDtoType(itm, report)) continue;
                    AttemptToInsertArrayItem(dtoType, itm, report);
                    report.RowsAffected++;
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
            report.Results.Add(itm);
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