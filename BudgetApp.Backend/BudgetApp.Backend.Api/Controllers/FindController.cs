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
    /// The <see cref="FindController"/> class. Responsible for performing 'find' / select operations from the data store. 
    /// </summary>
    [ApiController]
    public class FindController : DataController
    {
        private readonly ILogger<FindController> _logger;

        /// <summary>
        /// Initializes an instance of the <see cref="FindController"/> class.
        /// </summary>
        /// <param name="logger">the application logger</param>
        /// <param name="options">the application settings</param>
        public FindController(ILogger<FindController> logger, IOptions<ApplicationSettings> options) : base(options)
        {
            _logger = logger;
        }

        /// <summary>
        /// Overrides the base implementation of the <see cref="GetJsonSerializerOptions"/> to include the custom converter
        /// for comparable items.
        /// </summary>
        /// <returns>The <see cref="JsonSerializerOptions"/> for converting a json request into a class.</returns>
        protected override JsonSerializerOptions GetJsonSerializerOptions()
        {
            var jsonOptions = base.GetJsonSerializerOptions();
            jsonOptions.Converters.Add(new ComparableItemConverter<IComparableItem>());
            return jsonOptions;
        }

        /// <summary>
        /// Finds all items available for a requested document type
        /// </summary>
        /// <param name="requestedType">the type of document being searched for</param>
        /// <returns>A <see cref="HttpResponse"/> indicating whether the operation was successful, if it was then the
        /// documents are returned.</returns>
        [HttpGet]
        [Route("{requestedType}/findAll")]
        public async Task<HttpResponse> FindAll(string requestedType)
        {
            var dtoType = Manager.GetDtoType(requestedType);
            if (dtoType == null)
            {
                return await TypeNotAvailable(requestedType);
            }

            const string fetchAll = "{}";
            return await SerializedObjectResponse(Manager.Find(dtoType.Name, dtoType, fetchAll));
        }

        /// <summary>
        /// The Find endpoint, finds items belonging to a type based on a query provided within the request body
        /// </summary>
        /// <param name="requestedType">the type of document being searched for</param>
        /// <returns>A <see cref="HttpResponse"/> indicating whether the operation was successful, if it was then the
        /// documents are returned.</returns>
        [HttpPost]
        [Route("{requestedType}/find")]
        public async Task<HttpResponse> Find(string requestedType)
        {
            var dtoType = Manager.GetDtoType(requestedType);
            if (dtoType == null)
            {
                return await TypeNotAvailable(requestedType);
            }

            var requestBody = await GetRequestBody();
            var queryParser = new MongoFilterParser();
            if (!ParseQuerySuccessful(queryParser, dtoType, requestBody))
            {
                return await SerializedObjectResponse(queryParser.Report, 400);
            }

            var mongoFindResponse = Manager.Find(dtoType.Name, dtoType, queryParser.Result);
            if (mongoFindResponse is IList array)
            {
                if (array.Count > 0)
                {
                    return await SerializedObjectResponse(mongoFindResponse);
                }
            }
            else if (mongoFindResponse is RequestReport report)
            {
                return await SerializedObjectResponse(report);
            }

            return await NoFindDataFound(requestedType, queryParser);
        }

        /// <summary>
        /// Returns a <see cref="HttpResponse"/> with a <see cref="RequestReport"/> containing a result stating that
        /// no data was found for the provided object or query.
        /// </summary>
        /// <param name="requestedType">the type being searched against</param>
        /// <param name="filterParser">the query parser</param>
        /// <returns>A <see cref="HttpResponse"/> stating that no data can be found</returns>
        private async Task<HttpResponse> NoFindDataFound(string requestedType, MongoFilterParser filterParser)
        {
            filterParser.Report.Messages.Add(new Message
            {
                ErrorCode = ApiErrorCode.NoResultsReturned,
                Level = IncidentLevel.Warning,
                MessageText = $"No results found for {requestedType} with the given query",
                Parameters = {filterParser.Result}
            });
            return await SerializedObjectResponse(filterParser.Report);
        }

        /// <summary>
        /// Attempts to parse a query
        /// </summary>
        /// <param name="filterParser">the filter parser, responsible for converting the request body into a query</param>
        /// <param name="dtoType">the class for the document type we are searching against</param>
        /// <param name="requestBody">the body containing the unparsed query</param>
        /// <returns></returns>
        private bool ParseQuerySuccessful(MongoFilterParser filterParser, Type dtoType, string requestBody)
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

            return filterParser.Parse(dtoType, comparableItem);
        }
    }
}