namespace BudgetApp.Backend.Dto
{
    public class CollectionDefaultsFromAttribute : ConfigTypeAttribute<string>
    {
        public CollectionDefaultsFromAttribute(string value = "") : base(value) { }
    }
}