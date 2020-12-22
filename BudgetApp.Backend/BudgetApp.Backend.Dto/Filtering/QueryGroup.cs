using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using BudgetApp.Backend.Dto.Interfaces;

namespace BudgetApp.Backend.Dto.Filtering
{
    public class QueryGroup : IComparableItem
    {
        [JsonPropertyName("comparisonType")]
        public FilterType ComparisonType { get; set; }
        [JsonPropertyName("queries")]
        public List<IComparableItem> Queries { get; set; }
    }
}