using System.Threading.Tasks;
using BudgetApp.Backend.Api.Configuration;
using BudgetApp.Backend.Api.Controllers.BaseClasses;
using BudgetApp.Backend.Api.Services;
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

        public InsertController(ILogger<InsertController> logger,IOptions<ApplicationSettings> options) : base(options)
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
            return await SerializedObjectResponse("ok");
        }
    }
}