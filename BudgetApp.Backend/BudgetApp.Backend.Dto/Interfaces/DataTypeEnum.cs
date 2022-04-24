using System.Text.Json.Serialization;

namespace BudgetApp.Backend.Dto
{
    public enum DataTypeEnum
    {
        [JsonPropertyName("id")]
        Id,
        [JsonPropertyName("relatedId")]
        RelatedId,
        [JsonPropertyName("string")]
        String,
        [JsonPropertyName("number")]
        Number,
        [JsonPropertyName("dateTime")]
        DateTime,
        [JsonPropertyName("boolean")]
        Boolean,
        [JsonPropertyName("color")]
        Color
    }
}