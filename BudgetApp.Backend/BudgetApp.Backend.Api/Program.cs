using System.Security.Cryptography.X509Certificates;
using BudgetApp.Backend.Api.Configuration;

var BudgetAllowOrigins = "_budgetAllowOrigins";

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    var config = builder.Configuration.GetSection("AppSettings").Get<ApplicationSettings>();

    if (config == null)
    {
        throw new InvalidOperationException($"{nameof(config)} - AppSettings section is not configured");
    }

    var certPem = File.ReadAllText(new FileInfo(config.PemCertificate.Path).FullName);
    var keyPem = File.ReadAllText(new FileInfo(config.PemCertificate.KeyPath).FullName);

    serverOptions.ConfigureHttpsDefaults(listenOptions =>
    {
        listenOptions.ServerCertificate = X509Certificate2.CreateFromPem(certPem, keyPem);
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        name: BudgetAllowOrigins,
        policy =>
        {
            policy.WithOrigins("https://0.0.0.0:3000",
                                "https://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
        });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.Configure<ApplicationSettings>(builder.Configuration.GetSection("AppSettings"));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
        options.RoutePrefix = string.Empty;
    });
}

// Configure the HTTP request pipeline.
app.UseHttpsRedirection();
app.UseRouting();
app.UseCors(BudgetAllowOrigins);
app.UseAuthorization();
app.MapControllers();
app.Run();

