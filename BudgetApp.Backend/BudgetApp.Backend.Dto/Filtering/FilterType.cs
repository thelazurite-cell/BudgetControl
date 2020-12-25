using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace BudgetApp.Backend.Dto.Filtering
{
    public enum FilterType
    {
        [EnumMember(Value = "")] None = 0,
        [EnumMember(Value = "_id")] ById = 1,
        [EnumMember(Value = "$eq")] Equals = 2,
        [EnumMember(Value = "$ne")] NotEquals = 3,
        [EnumMember(Value = "$in")] In = 4,
        [EnumMember(Value = "$nin")] NotIn = 5,
        [EnumMember(Value = "$gt")] GreaterThan = 6,
        [EnumMember(Value = "$gte")] GreaterThanOrEqual = 7,
        [EnumMember(Value = "$lt")] LessThan = 8,
        [EnumMember(Value = "$lte")] LessThanOrEqual = 9,
        [EnumMember(Value = "$and")] And = 10,
        [EnumMember(Value = "$or")] Or = 11,
        [EnumMember(Value = "$not")] Not = 12,
        [EnumMember(Value = "$regex")] Matches = 13
    }
}