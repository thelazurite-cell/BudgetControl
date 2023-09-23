namespace BudgetApp.Backend.Dto
{
    public class DataRelatesToAttribute : ConfigTypeAttribute<string>
    {
        public DataRelatesToAttribute(string value) : base(value)
        {
        }
    }


}