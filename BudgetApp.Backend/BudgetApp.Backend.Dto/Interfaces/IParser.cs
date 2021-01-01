namespace BudgetApp.Backend.Dto.Filtering
{
    public interface IParser
    {
        public string Result { get; set; }
        public RequestReport Report { get; }
    }
}