namespace BudgetApp.Backend.Dto
{
    public class DataWholeNumberAttribute : ConfigTypeAttribute<bool>
    {
        public DataWholeNumberAttribute(bool value = true) : base(value)
        {
        }
    }
}