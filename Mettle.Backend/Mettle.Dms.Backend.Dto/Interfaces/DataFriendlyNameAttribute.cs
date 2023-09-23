namespace BudgetApp.Backend.Dto
{
    public class DataFriendlyNameAttribute : ConfigTypeAttribute<string>
    {
        public DataFriendlyNameAttribute(string value) : base(value)
        {
        }
    }
}