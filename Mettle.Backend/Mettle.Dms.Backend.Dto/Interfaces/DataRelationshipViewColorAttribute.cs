namespace BudgetApp.Backend.Dto
{
    public class DataRelationshipViewColorAttribute : ConfigTypeAttribute<bool>
    {
        public DataRelationshipViewColorAttribute(bool value = true) : base(value)
        {
        }
    }
}