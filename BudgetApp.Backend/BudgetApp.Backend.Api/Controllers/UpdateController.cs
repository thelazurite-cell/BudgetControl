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
    /// <summary>
    /// The <see cref="UpdateController"/> class. responsible for updating items within a collection.
    /// </summary>
    [ApiController]
    public class UpdateController : DataController
    {
        private readonly ILogger<UpdateController> _logger;

        /// <summary>
        /// Initializes an instance of the <see cref="UpdateController"/> class.
        /// </summary>
        /// <param name="logger">the controller's logger.</param>
        /// <param name="options">the application settings.</param>
        public UpdateController(ILogger<UpdateController> logger, IOptions<ApplicationSettings> options) : base(options)
        {
            _logger = logger;
        }

        /// <summary>
        /// Updates a single item of a given type with the requested ID. the columns to update are contained within the request body.
        /// </summary>
        /// <param name="requestedType">The collection/type to update.</param>
        /// <param name="id">the identifier of the item to update</param>
        /// <returns>A <see cref="HttpResponse"/> denoting whether the operation was successful or not</returns>
        [HttpPost]
        [Route("{requestedType}/update/{id}")]
        public async Task Update(string requestedType, string id)
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
                await SerializedObjectResponse(
                    RequestReportGenerator.ErrorReadingDataReport(dtoType.Name, requestBody));
                return;
            }

            var deserialize = GetJsonDeserializeForDto(dtoType);
            var dto = deserialize.Invoke(null, new object[] {requestBody, GetJsonSerializerOptions()});

            if (!IsDtoType(dto))
            {
                await SerializedObjectResponse(
                    RequestReportGenerator.ErrorReadingDataReport(dtoType.Name, requestBody));
                return;
            }

            dto.GetType().GetProperty("IsDirty").SetValue(dto, false);
            var parser = new MongoUpdateParser();
            if (parser.Parse(dto))
            {
                var res = Manager.Update(dtoType.Name, dtoType, new QueryBuilder(dtoType).ById(id).Build(),
                    parser.Result);
                await SerializedObjectResponse(res);
            }
            else
            {
                await SerializedObjectResponse(parser.Report);
            }
        }
    }
}