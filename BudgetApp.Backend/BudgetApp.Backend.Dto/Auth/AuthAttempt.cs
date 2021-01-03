using System.Text.Json.Serialization;

namespace BudgetApp.Backend.Api.Controllers
{
    public class AuthAttempt
    {
        [JsonPropertyName("attempt")]
        public string Attempt { get; set; }
    }
}