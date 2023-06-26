//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;
//using Microsoft.AspNetCore.Hosting;
//using Microsoft.Extensions.Configuration;
//using Microsoft.Extensions.Hosting;
//using Microsoft.Extensions.Logging;
//using MongoDB.Driver;

//namespace BudgetApp.Backend.Api
//{
//    public class Program
//    {
//        public static void Main(string[] args)
//        {
//            CreateHostBuilder(args).Build().Run();
//        }

//        public static IHostBuilder CreateHostBuilder(string[] args) =>
//            Host.CreateDefaultBuilder(args)
//                .ConfigureWebHostDefaults(webBuilder =>
//                {
//                    webBuilder.UseStartup<Startup>();
//                });
//    }
//}

using BudgetApp.Backend.Api.Configuration;
using Microsoft.Extensions.Configuration;

var BudgetAllowOrigins = "_budgetAllowOrigins";

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: BudgetAllowOrigins,
                      policy =>
                      {
                          policy.WithOrigins("https://192.168.0.14:3000",
                                              "https://localhost:3000")
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                      });
});

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.Configure<ApplicationSettings>(builder.Configuration.GetSection("AppSettings"));

var app = builder.Build();

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
        options.RoutePrefix = string.Empty;
    });
//}

app.UseHttpsRedirection();

app.UseRouting();
app.UseCors(BudgetAllowOrigins);
app.UseAuthorization();

//app.UseEndpoints(endpoints => { endpoints.MapControllers(); });

app.MapControllers();

app.Run();

