using System.Runtime.Serialization;
using BudgetApp.Backend.Dto.Filtering;

namespace BudgetApp.Backend.Dto.Interfaces
{
    public interface IComparableItem
    {
        [DataMember(Name="comparisonType")]
        public FilterType ComparisonType { get; set; }
    }
}