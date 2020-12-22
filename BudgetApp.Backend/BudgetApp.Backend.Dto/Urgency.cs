using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace BudgetApp.Backend.Dto
{
    public enum Urgency
    {
        [JsonPropertyName("none")]
        None,
        [JsonPropertyName("low")]
        Low,
        [JsonPropertyName("medium")]
        Medium,
        [JsonPropertyName("high")]
        High,
        [JsonPropertyName("critical")]
        Critical
    }
}