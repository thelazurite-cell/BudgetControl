namespace BudgetApp.Backend.Dto
{
    public class DataExpandableHeaderAttribute : ConfigTypeAttribute<bool>
    {
        public DataExpandableHeaderAttribute(bool value = true) : base(value)
        {
        }
    }
}