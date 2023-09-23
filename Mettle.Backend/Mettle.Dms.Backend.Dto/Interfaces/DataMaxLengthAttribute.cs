namespace BudgetApp.Backend.Dto
{
    public class DataMaxLengthAttribute : ConfigTypeAttribute<int>
    {
        public DataMaxLengthAttribute(int value) : base(value)
        {
        }
    }
}