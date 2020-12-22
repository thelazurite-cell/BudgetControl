namespace BudgetApp.Backend.Api.Configuration
{
    public class GeneralSettings
    {
        public string UserApplication { get; set; }
        public string AdminEmail { get; set; }
        public int MaxGuesses { get; set; }
        public int TokenExpiryMinutes { get; set; }
        public bool HumanReadableJson { get; set; }
        public string DtoDllName { get; set; }
    }
}