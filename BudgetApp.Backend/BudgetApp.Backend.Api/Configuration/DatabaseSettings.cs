namespace BudgetApp.Backend.Api.Configuration
{
    public class DatabaseSettings
    {
        public string Host { get; set; }
        public int Port { get; set; }
        public string DatabaseName { get; set; }

        public bool UsesAuthentication { get; set; }
        public string AuthenticationType { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public bool AllowInsecureTls { get; set; }
        public bool UseTls { get; set; }
        public string AuthenticationDatabaseName { get; set; }
    }
}