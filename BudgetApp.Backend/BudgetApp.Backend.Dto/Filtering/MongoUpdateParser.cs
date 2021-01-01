using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text.Json.Serialization;
using BudgetApp.Backend.Dto.Auth;
using BudgetApp.Backend.Dto.Interfaces;
using MongoDB.Bson.Serialization.Attributes;
using static BudgetApp.Backend.Dto.Filtering.MongoQueryHelper;

namespace BudgetApp.Backend.Dto.Filtering
{
    public class MongoUpdateParser : IParser
    {
        public string Result { get; set; } = string.Empty;
        public RequestReport Report { get; } = new();

        public bool Parse(object dto)
        {
            Result += $"{{ \"{FilterType.Set.ToComparisonType()}\": {{";

            var temp = new List<string>();
            var properties = dto.GetType().GetProperties();
            if (!GenerateUpdatesSuccessful(dto, properties, temp))
            {
                return false;
            }

            Result += string.Join(',', temp);
            Result += "} }";
            return true;
        }

        private bool GenerateUpdatesSuccessful(object dto, IEnumerable<PropertyInfo> properties, List<string> temp)
        {
            return properties.Where(property => !ValueShouldBeIgnored(property))
                .All(property => GenerateUpdateQueryForProperty(dto, property, temp));
        }

        private static bool ValueShouldBeIgnored(MemberInfo property)
        {
            return Attribute.IsDefined(property, typeof(BsonIgnoreAttribute)) ||
                   Attribute.IsDefined(property, typeof(JsonIgnoreAttribute));
        }

        private bool GenerateUpdateQueryForProperty(object dto, PropertyInfo property, List<string> temp)
        {
            var attrib = GetJsonAttribute(property);
            if (!HasValidAttribute(attrib)) return false;
            var requiresQuoteWrap = RequiresQuoteWrap(property);
            var value = property.GetValue(dto);
            if (!BooleanCheckSuccessful(property, ref value)) return false;
            var propValue = requiresQuoteWrap ? $"\"{value}\"" : value;

            temp.Add($"\"{attrib.Name}\":{propValue}");
            return true;
        }

        private bool BooleanCheckSuccessful(PropertyInfo property, ref object value)
        {
            if (property.PropertyType == typeof(bool))
            {
                if (value.ToString().ToLower() != "true" && value.ToString().ToLower() != "false")
                {
                    AddError(ApiErrorCode.InvalidPropertyValue, "Value must be true or false for a boolean",
                        new List<string> {property.Name, value.ToString()});
                    return false;
                }

                value = value.ToString().ToLower();
            }

            return true;
        }

        private bool HasValidAttribute(JsonPropertyNameAttribute attrib)
        {
            if (attrib == null)
            {
                Report.IsSuccess = false;
                Report.Messages.Add(new Message()
                {
                    ErrorCode = ApiErrorCode.InvalidProperty,
                    Level = IncidentLevel.Error,
                    MessageText = "Attempted to update a field which is not a part of the document"
                });
                return false;
            }

            return true;
        }
        private void AddError(ApiErrorCode errorCode, string message, List<string> parameters = null)
        {
            Report.IsSuccess = false;
            Report.Messages.Add(new Message
            {
                ErrorCode = errorCode,
                MessageText = message,
                Level = IncidentLevel.Error,
                Parameters = parameters
            });
        }
    }
}