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
    /// <summary>
    /// The <see cref="DeleteController"/> class
    /// </summary>
    [ApiController]
    public class DeleteController : DataController
    {
        private readonly ILogger<DeleteController> _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="DeleteController"/> class. Used for deleting documents from data storage
        /// </summary>
        /// <param name="logger">the application logger</param>
        /// <param name="options">the application settings</param>
        public DeleteController(ILogger<DeleteController> logger, IOptions<ApplicationSettings> options) : base(options)
        {
            _logger = logger;
        }

        /// <summary>
        /// Deletes an object with the requested type, and identifier
        /// </summary>
        /// <param name="requestedType">the type of object to delete</param>
        /// <param name="id">the identifier of the object.</param>
        /// <returns>A <see cref="HttpResponse"/> indicating whether the operation was successful or not.</returns>
        [HttpDelete]
        [Route("{requestedType}/delete/{id}")]
        public async Task DeleteAsync(string requestedType, string id)
        {
            var dtoType = Manager.GetDtoType(requestedType);
            if (dtoType == null)
            {
                await TypeNotAvailable(requestedType);
                return;
            }

            var builder = new QueryBuilder(dtoType);
            var query = builder.ById(id).Build();
            var res = Manager.Delete(dtoType.Name, dtoType, query);
            await SerializedObjectResponse(res, res.IsSuccess ? 200 : 400);
        }
    }
}