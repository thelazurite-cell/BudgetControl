namespace BudgetApp.Backend.Api.Configuration;

/// <summary>
/// 
/// </summary>
public class ApplicationSettings
{
    public PemCertificate PemCertificate { get; set; } = new();
    /// <summary>
    /// The database connection configuration.
    /// </summary>
    public DatabaseSettings Database { get; set; } = new();

    /// <summary>
    /// The general settings for the application.
    /// </summary>
    public GeneralSettings General { get; set; } = new();
}

public class PemCertificate
{
    public string Path { get; set; } = string.Empty;
    public string KeyPath { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}