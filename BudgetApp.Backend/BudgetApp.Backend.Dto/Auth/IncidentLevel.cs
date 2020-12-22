using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace BudgetApp.Backend.Dto.Auth
{
    public enum IncidentLevel
    {
        [JsonPropertyName("critical")] Critical,
        [JsonPropertyName("error")] Error,
        [JsonPropertyName("high")] High,
        [JsonPropertyName("warning")] Warning,
        [JsonPropertyName("debug")] Debug,
        [JsonPropertyName("low")] Low,
        [JsonPropertyName("none")] None
    }
}