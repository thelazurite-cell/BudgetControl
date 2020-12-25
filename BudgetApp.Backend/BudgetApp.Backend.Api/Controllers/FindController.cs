using System;
using System.Collections;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using BudgetApp.Backend.Api.Configuration;
using BudgetApp.Backend.Api.Controllers.BaseClasses;
using BudgetApp.Backend.Api.Services;
using BudgetApp.Backend.Dto;
using BudgetApp.Backend.Dto.Auth;
using BudgetApp.Backend.Dto.Converters;
using BudgetApp.Backend.Dto.Filtering;
using BudgetApp.Backend.Dto.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Exception = System.Exception;

namespace BudgetApp.Backend.Api.Controllers
{
    /// <summary>
    /// The <see cref="FindController"/>. Responsible for performing 'find' / select operations from the data store. 
    /// </summary>
    [ApiController]
    public class FindController : DataController
    {
        private readonly ILogger<FindController> _logger;
        private MongoManager _manager;

        public FindController(ILogger<FindController> logger, IOptions<ApplicationSettings> options): base (options)
        {
            _logger = logger;
            _manager = new MongoManager(Options);
        }

        protected override JsonSerializerOptions GetJsonSerializerOptions()
        {
            var jsonOptions =  base.GetJsonSerializerOptions();
            jsonOptions.Converters.Add(new ComparableItemConverter<IComparableItem>());
            return jsonOptions;
        }

        [HttpGet()] 
        [Route("{requestedType}/findAll")]
        public async Task<HttpResponse> Get(string requestedType)
        {
            var dtoType = _manager.GetDtoType(requestedType);
            if (dtoType == null)
            {
                return await TypeNotAvailable(requestedType);
            }

            const string fetchAll = "{}";
            return await SerializedObjectResponse(_manager.GetMongoFindResponse(requestedType, dtoType, fetchAll));
        }

        [HttpPost]
        [Route("{requestedType}/find")]
        public async Task<HttpResponse> Find(string requestedType)
        {
            var dtoType = _manager.GetDtoType(requestedType);
            if (dtoType == null)
            {
                return await TypeNotAvailable(requestedType);
            }

            var requestBody = await GetRequestBodyJson();
            var queryParser = new MongoQueryParser();
            if(!ParseQuerySuccessful(queryParser, dtoType, requestBody))
            {
                return await SerializedObjectResponse(queryParser.RequestReport, 400);
            }

            var mongoFindResponse = _manager.GetMongoFindResponse(requestedType, dtoType, queryParser.Result);
            if (mongoFindResponse is IList array)
            {
                if (array.Count > 0)
                {
                    return await SerializedObjectResponse(mongoFindResponse);
                }
            }
            return await NoFindDataFound(requestedType, queryParser);
        }

        private async Task<HttpResponse> NoFindDataFound(string requestedType, MongoQueryParser queryParser)
        {
            queryParser.RequestReport.Messages.Add(new Message
            {
                ErrorCode = ApiErrorCode.NoResultsReturned,
                Level = IncidentLevel.Warning,
                MessageText = $"No results found for {requestedType} with the given query",
                Parameters = {queryParser.Result}
            });
            return await SerializedObjectResponse(queryParser.RequestReport);
        }

        private bool ParseQuerySuccessful(MongoQueryParser queryParser, Type dtoType, string requestBody)
        {

            IComparableItem? comparableItem;
            try
            {
                comparableItem = JsonSerializer.Deserialize<IComparableItem>(requestBody, GetJsonSerializerOptions());
            }
            catch (Exception e)
            {
                comparableItem = null;
            }
            return queryParser.GenerateQuery(dtoType, comparableItem);
        }
    }
}
