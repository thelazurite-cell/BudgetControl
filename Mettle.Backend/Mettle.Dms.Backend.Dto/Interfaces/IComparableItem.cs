using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using BudgetApp.Backend.Dto.Converters;
using BudgetApp.Backend.Dto.Filtering;

namespace BudgetApp.Backend.Dto.Interfaces
{
    public interface IComparableItem: ITypeDiscriminator
    {
        
        [JsonPropertyName("comparisonType")]
        public FilterType? ComparisonType { get; set; }
        
        [JsonPropertyName("typeDiscriminator")]
        public string TypeDiscriminator { get; }
    }
}