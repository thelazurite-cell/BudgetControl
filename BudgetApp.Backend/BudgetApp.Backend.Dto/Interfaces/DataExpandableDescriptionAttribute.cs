namespace BudgetApp.Backend.Dto
{
    public class DataExpandableDescriptionAttribute : ConfigTypeAttribute<bool>
    {
        public DataExpandableDescriptionAttribute(bool value = true) : base(value)
        {
        }
    }
}