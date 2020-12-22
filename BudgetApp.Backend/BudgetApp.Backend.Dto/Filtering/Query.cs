using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using BudgetApp.Backend.Dto.Interfaces;

namespace BudgetApp.Backend.Dto.Filtering
{
    public class Query: IComparableItem
    {
        [JsonPropertyName("comparisonType")]
        public FilterType ComparisonType { get; set; }
        [DataMember(Name="fieldName")]
        public string FieldName { get; set; }
        [JsonPropertyName("fieldValue")]
        public string FieldValue { get; set; }
    }
}