using System;

namespace BudgetApp.Backend.Dto
{
    public class ConfigTypeAttribute<T> : Attribute
    {
        public T Value { get; }

        public ConfigTypeAttribute(T value)
        {
            Value = value;
        }
    }
}