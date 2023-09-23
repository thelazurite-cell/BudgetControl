namespace BudgetApp.Backend.Dto
{
    public class DataSensitiveAttribute : ConfigTypeAttribute<bool>
    {
        public DataSensitiveAttribute(bool value = true) : base(value)
        {
        }
    }
}