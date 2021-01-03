using System.Threading.Tasks;
using BudgetApp.Backend.Api.Configuration;
using BudgetApp.Backend.Api.Controllers.BaseClasses;
using BudgetApp.Backend.Api.Services;
using BudgetApp.Backend.Dto.Filtering;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BudgetApp.Backend.Api.Controllers
{
    [ApiController]
    public class DeleteController : DataController
    {
        private readonly ILogger<DeleteController> _logger;
        private MongoManager _manager;

        public DeleteController(ILogger<DeleteController> logger, IOptions<ApplicationSettings> options) : base(options)
        {
            _logger = logger;
            _manager = new MongoManager(options);
        }

        [HttpDelete]
        [Route("{requestedType}/delete/{id}")]
        public async Task<HttpResponse> DeleteAsync(string requestedType, string id)
        {
            var dtoType = _manager.GetDtoType(requestedType);
            if (dtoType == null)
            {
                return await TypeNotAvailable(requestedType);
            }

            var builder = new QueryBuilder(dtoType);
            var query = builder.ById(id).Build();
            var res = _manager.Delete(dtoType.Name, dtoType, query);
            return await SerializedObjectResponse(res, res.IsSuccess ? 200 : 400);
        }
    }
}