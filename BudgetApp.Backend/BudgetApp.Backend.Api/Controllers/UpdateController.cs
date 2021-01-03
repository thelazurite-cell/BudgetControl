using System.Threading.Tasks;
using BudgetApp.Backend.Api.Configuration;
using BudgetApp.Backend.Api.Controllers.BaseClasses;
using BudgetApp.Backend.Api.Services;
using BudgetApp.Backend.Dto.Filtering;
using BudgetApp.Backend.Dto.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BudgetApp.Backend.Api.Controllers
{
    [ApiController]
    public class UpdateController : DataController
    {
        private readonly ILogger<UpdateController> _logger;
        private MongoManager _manager;

        public UpdateController(ILogger<UpdateController> logger, IOptions<ApplicationSettings> options) : base(options)
        {
            _logger = logger;
            _manager = new MongoManager(options);
        }

        [HttpPost]
        [Route("{requestedType}/update/{id}")]
        public async Task<HttpResponse> Update(string requestedType, string id)
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
            var dto = deserialize.Invoke(null, new object[] {requestBody, GetJsonSerializerOptions()});
            
            if (!IsDtoType(dto))
            {
                return await SerializedObjectResponse(
                    RequestReportGenerator.ErrorReadingDataReport(requestedType, requestBody));
            }

            var parser = new MongoUpdateParser();
            if (parser.Parse(dto))
            {
                var res = Manager.Update(requestedType, dtoType, new QueryBuilder(dtoType).ById(id).Build(), parser.Result);
                return await SerializedObjectResponse(res);
            }
            else
            {
                return await SerializedObjectResponse(parser.Report);
            }

        }
    }
}