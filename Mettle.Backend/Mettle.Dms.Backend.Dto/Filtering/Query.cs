using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using BudgetApp.Backend.Dto.Interfaces;

namespace BudgetApp.Backend.Dto.Filtering
{
    public class Query : IComparableItem
    {
        [JsonPropertyName("comparisonType")]
        public FilterType? ComparisonType { get; set; }

        [JsonPropertyName("typeDiscriminator")]
        public string TypeDiscriminator => nameof(Query);
        [JsonPropertyName("fieldName")]
        public string FieldName { get; set; } = "";
        [JsonPropertyName("fieldValue")]
        public List<string> FieldValue { get; set; } = new List<string>();
    }
}