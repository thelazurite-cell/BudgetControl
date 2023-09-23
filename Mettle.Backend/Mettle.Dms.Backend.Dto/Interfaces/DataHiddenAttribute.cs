namespace BudgetApp.Backend.Dto
{
    public class DataHiddenAttribute : ConfigTypeAttribute<bool>
    {
        public DataHiddenAttribute(bool value = true) : base(value)
        {
        }
    }




}