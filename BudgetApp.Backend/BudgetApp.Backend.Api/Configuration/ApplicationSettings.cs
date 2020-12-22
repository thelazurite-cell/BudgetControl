namespace BudgetApp.Backend.Api.Configuration
{
    public class ApplicationSettings
    {
        public DatabaseSettings Database { get; set; }
        public GeneralSettings General { get; set; }
    }

    public class DatabaseSettings
    {
        public string Host { get; set; }
        public string DatabaseName { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
    }

    public class GeneralSettings
    {
        public string UserApplication { get; set; }
        public string AdminEmail { get; set; }
        public int MaxGuesses { get; set; }
        public int TokenExpiryMinutes { get; set; }
    }
}