namespace BudgetApp.Backend.Dto
{
    public class DataMinLengthAttribute : ConfigTypeAttribute<int>
    {
        public DataMinLengthAttribute(int value) : base(value)
        {
        }
    }
}