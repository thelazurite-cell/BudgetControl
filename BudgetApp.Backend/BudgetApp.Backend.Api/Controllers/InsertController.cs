using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text.Json;
using System.Threading.Tasks;
using BudgetApp.Backend.Api.Configuration;
using BudgetApp.Backend.Api.Controllers.BaseClasses;
using BudgetApp.Backend.Api.Services;
using BudgetApp.Backend.Dto.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

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
                var res = Manager.Insert(requestedType, dtoType, deserializedObject);
                return await SerializedObjectResponse(res);
            }

            return await SerializedObjectResponse(
                RequestReportGenerator.ErrorReadingDataReport(requestedType, requestBody));
        }
    }
}