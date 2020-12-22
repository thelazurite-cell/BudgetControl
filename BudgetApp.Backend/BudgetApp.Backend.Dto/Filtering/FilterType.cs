using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace BudgetApp.Backend.Dto.Filtering
{
    public enum FilterType
    {
        [JsonPropertyName("")] None,
        [JsonPropertyName("$_id")] ById,
        [JsonPropertyName("$eq")] Equals,
        [JsonPropertyName("$ne")] NotEquals,
        [JsonPropertyName("$in")] In,
        [JsonPropertyName("$nin")] NotIn,
        [JsonPropertyName("$gt")] GreaterThan,
        [JsonPropertyName("$gte")] GreaterThanOrEqual,
        [JsonPropertyName("$lt")] LessThan,
        [JsonPropertyName("$lte")] LessThanOrEqual,
        [JsonPropertyName("$and")] And,
        [JsonPropertyName("$or")] Or,
        [JsonPropertyName("$not")] Not,
        [JsonPropertyName("$regex")] Matches
    }
}