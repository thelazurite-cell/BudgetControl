namespace BudgetApp.Backend.Dto
{
    public class DataSchemaExpandableAttribute : ConfigTypeAttribute<bool>
    {
        public DataSchemaExpandableAttribute(bool value = true) : base(value)
        {
        }
    }
}