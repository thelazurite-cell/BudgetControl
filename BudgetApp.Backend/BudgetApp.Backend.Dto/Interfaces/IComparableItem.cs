using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using BudgetApp.Backend.Dto.Converters;
using BudgetApp.Backend.Dto.Filtering;

namespace BudgetApp.Backend.Dto.Interfaces
{
    public abstract class ComparableItem: ITypeDiscriminator
    {
        
        [JsonPropertyName("comparisonType")]
        public FilterType ComparisonType { get; set; }

        public ComparableItem()
        {
            
        }
        [JsonPropertyName("typeDiscriminator")]
        public virtual string TypeDiscriminator { get; }
    }
}