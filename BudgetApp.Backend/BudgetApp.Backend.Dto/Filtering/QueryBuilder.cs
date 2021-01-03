using System;
using System.Collections.Generic;
using BudgetApp.Backend.Dto.Interfaces;

namespace BudgetApp.Backend.Dto.Filtering
{
    public class QueryBuilder
    {
        private Type _type;
        private IComparableItem _object;
        private int _currQuery = 0;

        public RequestReport Report { get; set; }
        public IComparableItem Object => _object;

        public QueryBuilder(Type type)
        {
            _type = type;
        }

        public QueryBuilder With => this;
        public QueryBuilder And => this;

        public QueryBuilder ById(string id)
        {
            _object = new QueryGroup
            {
                ComparisonType = FilterType.ById,
                Queries = new List<IComparableItem>
                {
                    new Query
                    {
                        ComparisonType = FilterType.ById,
                        FieldValue = new List<string>(){id}
                    }
                }
            };
            return this;
        }

        public QueryBuilder CreateAQueryGroup(FilterType filterType = FilterType.None)
        {
            var queryGroup = new QueryGroup();
            if (filterType != FilterType.None)
            {
                queryGroup.ComparisonType = filterType;
            }
            _object = queryGroup;

            return this;
        }

        public QueryBuilder CreateAQuery()
        {
            if (_object is QueryGroup qg)
            {
                if (qg.Queries == null)
                {
                    qg.Queries = new List<IComparableItem>();
                }
                qg.Queries.Add(new Query());
                _currQuery++;
                return this;
            }

            _object = new Query();
            return this;
        }

        public QueryBuilder WhereField(string fieldName)
        {
            switch (_object)
            {
                case QueryGroup queryGroup:
                {
                    if (queryGroup.Queries[_currQuery - 1] is not Query query)
                    {
                        return this;
                    }
                    query.FieldName = fieldName;
                    queryGroup.Queries[_currQuery -1] = query;

                    return this;
                }
                case Query query:
                    query.FieldName = fieldName;
                    _object = query;
                    break;
            }

            return this;
        }

        public QueryBuilder Equals(string fieldValue)
        {
            switch (_object)
            {
                case QueryGroup queryGroup:
                {
                    if (queryGroup.Queries[_currQuery - 1] is not Query query)
                    {
                        return this;
                    }

                    query.FieldValue = new List<string>{fieldValue};
                    query.ComparisonType = FilterType.Equals;
                    queryGroup.Queries[_currQuery -1] = query;
                    return this;
                }
                case Query query:
                    query.FieldValue = new List<string>{fieldValue};
                    query.ComparisonType = FilterType.Equals;
                    _object = query;
                    break;
            }

            return this;
        }

        public string Build()
        {
            var parser = new MongoFilterParser();
            var isSuccessful = parser.Parse(_type, _object);
            Report = parser.Report;
            if (isSuccessful)
            {
                return parser.Result;
            }

            throw new InvalidOperationException("Parse was not successful");
        }
        
    }
}