namespace BudgetApp.Backend.Dto
{
    public class DataTypeAttribute : ConfigTypeAttribute<DataTypeEnum>
    {
        public DataTypeAttribute(DataTypeEnum value) : base(value)
        {
        }
    }
}