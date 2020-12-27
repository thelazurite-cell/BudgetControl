using BudgetApp.Backend.Api.Configuration;
using BudgetApp.Backend.Api.Controllers.BaseClasses;
using BudgetApp.Backend.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BudgetApp.Backend.Api.Controllers
{
    [ApiController]
    public class DeleteController: DataController
    {
        private readonly ILogger<DeleteController> _logger;
        private MongoManager _manager;

        public DeleteController(ILogger<DeleteController> logger, IOptions<ApplicationSettings> options) : base(options)
        {
            _logger = logger;
            _manager = new MongoManager(options);
        }
    }
}