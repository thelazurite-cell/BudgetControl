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
            return await SerializedObjectResponse("Ok");
        }
    }
}