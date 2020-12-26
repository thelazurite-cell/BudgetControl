using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using BudgetApp.Backend.Dto;
using BudgetApp.Backend.Dto.Auth;
using BudgetApp.Backend.Dto.Filtering;
using BudgetApp.Backend.Dto.Interfaces;
using MongoDB.Bson;

namespace BudgetApp.Backend.Api.Services
{
    public class MongoQueryParser
    {
        public string Result { get; set; } = string.Empty;
        public RequestReport RequestReport { get; } = new();

        public static List<Type> WrappedInQuoteTypes { get; } = new List<Type>
        {
            typeof(string),
            typeof(decimal),
            typeof(float)
        };

        public static bool QueryHasValidStructure(QueryGroup parameters)
        {
            return parameters != null && parameters.Queries != null && parameters.Queries.Count > 0;
        }

        public bool GenerateQuery(Type transferObjectType, IComparableItem? comparable)
        {
            if (EnsureValueNotNull(comparable)) return true;
            return comparable switch
            {
                QueryGroup queryGroup => GenerateForQueryGroup(transferObjectType, queryGroup),
                Query query => GenerateForQuery(transferObjectType, query),
                _ => UnexpectedDataProvided()
            };
        }

        private bool EnsureValueNotNull(IComparableItem? comparable)
        {
            if (comparable != null) return false;
            Result = "{}";
            RequestReport.Messages.Add(new Message
            {
                ErrorCode = ApiErrorCode.NoQueryProvided,
                Level = IncidentLevel.Warning,
                MessageText = "No query was provided, finding all instead"
            });
            return true;
        }

        private bool UnexpectedDataProvided()
        {
            AddError(ApiErrorCode.InvalidDataType, "Unexpected comparable item provided");
            return false;
        }

        private bool GenerateForQuery(Type transferObjectType, Query query)
        {
            if (!AttemptToFindProperty(transferObjectType, query, out var isString)) return false;
            return GenerateQueryType(query, isString);
            ;
        }

        private bool GenerateQueryType(Query query, bool requiresQuoteWrap)
        {
            if (query.ComparisonType == null)
            {
                AddError(ApiErrorCode.QueryRequiresComparisonType, "A query must provide a comparison type");
                return false;
            }

            Result += "{ ";
            Result += $"{query.FieldName}: ";
            Result += "{ ";
            Result += $"{GetComparisonType(query.ComparisonType ?? FilterType.None)}:  ";
            if (query.FieldValue.Count > 1 || query.ComparisonType == FilterType.In)
            {
                Result += "[";

                Result += string.Join(",", requiresQuoteWrap ? ToQuotedValueArray(query) : query.FieldValue);
                Result += "]";
            }
            else
            {
                Result += requiresQuoteWrap ? $"\"{query.FieldValue[0]}\"" : query.FieldValue[0];
            }

            Result += " }";
            Result += " }";
            return true;
        }

        private static List<string> ToQuotedValueArray(Query query)
        {
            var tmp = query.FieldValue.Select(value => $"\"{value}\"").ToList();
            return tmp;
        }

        private bool AttemptToFindProperty(Type transferObjectType, Query query, out bool requiresQuoteWrap)
        {
            requiresQuoteWrap = true;
            var found = false;
            var properties = transferObjectType.GetProperties();
            foreach (var property in properties)
            {
                if (!FindProperty(query, ref requiresQuoteWrap, property, ref found)) return false;
            }

            if (!found)
            {
                AddError(ApiErrorCode.InvalidProperty, $"{query.FieldName} is not a valid property.");
                return false;
            }

            return true;
        }

        private bool FindProperty(Query query, ref bool requiresQuoteWrap, PropertyInfo property, ref bool found)
        {
            foreach (var attribute in property.GetCustomAttributes())
            {
                if (attribute is not JsonPropertyNameAttribute jsonAttrib) continue;
                if (jsonAttrib.Name != query.FieldName) continue;
                found = true;
                requiresQuoteWrap = WrappedInQuoteTypes.Any(itm => itm == property.PropertyType);
                if (!PerformBooleanValidationIfRequired(query, property))
                    return false;
            }

            return true;
        }

        private bool PerformBooleanValidationIfRequired(Query query, PropertyInfo property)
        {
            if (property.PropertyType != typeof(bool)) return true;
            if (query.FieldValue[0].ToLower() == "true" || query.FieldValue[0].ToLower() == "false")
                return true;
            AddError(ApiErrorCode.InvalidPropertyValue, "Value must be true or false for a boolean",
                new List<string> {query.FieldName, string.Join(",", query.FieldValue)});
            return false;
        }

        private bool GenerateForQueryGroup(Type transferObjectType, QueryGroup queryGroup)
        {
            switch (queryGroup.ComparisonType)
            {
                case FilterType.ById:
                    return AttemptGenerateByIdQuery(queryGroup);
                case FilterType.And:
                case FilterType.Or:
                    return PerformAndOrGeneration(transferObjectType, queryGroup);
                default:
                    return GenerateQuerySection(transferObjectType, queryGroup);
            }
        }

        private bool PerformAndOrGeneration(Type transferObjectType, QueryGroup queryGroup)
        {
            if (!QueryHasValidStructure(queryGroup))
            {
                AddError(ApiErrorCode.InvalidQueryStructure, "Query structure is invalid.");
                return false;
            }

            if (queryGroup.Queries == null || queryGroup.Queries.Count != 2)
            {
                AddError(ApiErrorCode.NeedTwoParameters, "You need two parameters for and/or statements.");
                return false;
            }

            Result += $"\"${GetComparisonType(queryGroup.ComparisonType ?? FilterType.Or)}\": [";
            var successful = GenerateQuerySection(transferObjectType, queryGroup);
            Result += "]";
            return successful;
        }

        private bool GenerateQuerySection(Type transferObjectType, QueryGroup queryGroup)
        {
            if (!QueryHasValidStructure(queryGroup))
            {
                AddError(ApiErrorCode.InvalidQueryStructure, "Query structure is invalid.");
                return false;
            }

            for (var enumerator = 0; enumerator < queryGroup.Queries.Count; enumerator++)
            {
                var result = GenerateQuery(transferObjectType, queryGroup.Queries[enumerator] as IComparableItem);
                if (enumerator + 1 != queryGroup.Queries.Count)
                {
                    Result += ",";
                }

                if (!result) return false;
            }

            return true;
        }

        private string GetComparisonType(FilterType queryGroupComparisonType)
        {
            var enumType = queryGroupComparisonType.GetType();
            var memberInfos = enumType.GetMember(queryGroupComparisonType.ToString());
            var enumValueMemberInfo = memberInfos.FirstOrDefault(m => m.DeclaringType == enumType);
            var valueAttributes =
                enumValueMemberInfo.GetCustomAttributes(typeof(EnumMemberAttribute), false);
            return ((EnumMemberAttribute) valueAttributes[0]).Value;
        }

        private bool AttemptGenerateByIdQuery(QueryGroup queryGroup)
        {
            if (queryGroup.Queries == null || queryGroup.Queries.Count != 1)
            {
                AddError(ApiErrorCode.NeedOneParametersOnly, "You need one parameter to find by id");
                return false;
            }

            Result = $"{{_id: ObjectId(\"{((Query) queryGroup.Queries[0]).FieldValue[0]}\")}}";
            return true;
        }

        private void AddError(ApiErrorCode errorCode, string message, List<string> parameters = null)
        {
            RequestReport.IsSuccess = false;
            RequestReport.Messages.Add(new Message
            {
                ErrorCode = errorCode,
                MessageText = message,
                Level = IncidentLevel.Error,
                Parameters = parameters
            });
        }
    }
}