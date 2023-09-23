using System.Net;
using BudgetApp.Backend.Api.Configuration;
using Microsoft.AspNetCore.Rewrite;

var BudgetAllowOrigins = "_budgetAllowOrigins";

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.ConfigureEndpoints();
});

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        name: BudgetAllowOrigins,
        policy =>
        {
            policy.WithOrigins("https://0.0.0.0:3000",
                                "https://localhost:3000",
                                "https://192.168.0.21:3000")
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
    app.UseHsts();
}
var platform =  KestrelServerOptionsExtensions.IsWindows() ? "Windows" : "Unix";
var httpsSection = app.Configuration.GetSection($"{platform}:HttpServer:Endpoints:Https");
if (httpsSection.Exists())
{
    var httpsEndpoint = new EndpointConfiguration();
    httpsSection.Bind(httpsEndpoint);
    app.UseRewriter(new RewriteOptions().AddRedirectToHttps(
        statusCode: app.Environment.IsDevelopment() ? StatusCodes.Status302Found : StatusCodes.Status301MovedPermanently,
        sslPort: httpsEndpoint.Port));
}

// Configure the HTTP request pipeline.
// app.UseHttpsRedirection();
app.UseRouting();
app.UseCors(BudgetAllowOrigins);
app.UseAuthorization();
app.MapControllers();
app.Run();
