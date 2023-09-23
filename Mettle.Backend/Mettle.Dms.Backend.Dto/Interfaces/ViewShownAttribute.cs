namespace BudgetApp.Backend.Dto
{
    public class ViewShownAttribute : ConfigTypeAttribute<bool>
    {
        public ViewShownAttribute(bool value) : base(value)
        {
        }
    }
    public class ViewForceReloadAttribute : ConfigTypeAttribute<bool>
    {
        public ViewForceReloadAttribute(bool value) : base(value)
        { }
    }
}