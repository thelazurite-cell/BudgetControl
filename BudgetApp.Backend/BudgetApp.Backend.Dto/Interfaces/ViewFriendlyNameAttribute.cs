namespace BudgetApp.Backend.Dto
{
    public class ViewFriendlyNameAttribute : ConfigTypeAttribute<string>
    {
        public ViewFriendlyNameAttribute(string value) : base(value)
        {
        }
    }
}