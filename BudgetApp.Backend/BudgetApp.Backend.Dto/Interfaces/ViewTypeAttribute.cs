namespace BudgetApp.Backend.Dto
{
    public class ViewTypeAttribute : ConfigTypeAttribute<ViewTypeEnum>
    {
        public ViewTypeAttribute(ViewTypeEnum value = ViewTypeEnum.Table) : base(value)
        {
        }
    }
}