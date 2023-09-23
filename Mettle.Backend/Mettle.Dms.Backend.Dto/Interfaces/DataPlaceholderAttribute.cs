namespace BudgetApp.Backend.Dto
{
    public class DataPlaceholderAttribute : ConfigTypeAttribute<string>
    {
        public DataPlaceholderAttribute(string value) : base(value)
        {
        }
    }
}