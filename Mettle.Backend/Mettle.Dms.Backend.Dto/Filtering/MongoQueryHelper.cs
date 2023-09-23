using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace BudgetApp.Backend.Dto.Filtering
{
    public static class MongoQueryHelper
    {
        private static List<Type> WrappedInQuoteTypes { get; } = new()
        {
            typeof(string),
            typeof(decimal),
            typeof(float),
        };

        private static List<Type> DateTimeTypes { get; } = new()
        {
            typeof(DateTime)
        };

        public static bool RequiresQuoteWrap(PropertyInfo property)
        {
            return WrappedInQuoteTypes.Any(itm => itm == property.PropertyType);
        }

        public static bool IsDateType(PropertyInfo property)
        {
            return DateTimeTypes.Any(itm => itm == property.PropertyType);
        }

        public static string ToComparisonType(this FilterType queryGroupComparisonType)
        {
            var enumType = queryGroupComparisonType.GetType();
            var memberInfos = enumType.GetMember(queryGroupComparisonType.ToString());
            var enumValueMemberInfo = memberInfos.FirstOrDefault(m => m.DeclaringType == enumType);
            var valueAttributes =
                enumValueMemberInfo.GetCustomAttributes(typeof(EnumMemberAttribute), false);
            return ((EnumMemberAttribute)valueAttributes[0]).Value;
        }

        public static JsonPropertyNameAttribute? GetJsonAttribute(PropertyInfo property)
        {
            foreach (var attribute in property.GetCustomAttributes())
            {
                if (attribute is JsonPropertyNameAttribute jsonAttrib)
                {
                    return jsonAttrib;
                }
            }

            return null;
        }
    }
}