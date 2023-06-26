// using BudgetApp.Backend.Api.Configuration;
// using BudgetApp.Backend.Api.Extensions;
// using Microsoft.AspNetCore.Builder;
// using Microsoft.AspNetCore.Hosting;
// using Microsoft.Extensions.Configuration;
// using Microsoft.Extensions.DependencyInjection;
// using Microsoft.Extensions.Hosting;

// namespace BudgetApp.Backend.Api
// {
//     public class Startup
//     {
//         private string _applicationUrl;
//         public Startup(IHostEnvironment env)
//         {
//             var builder = new ConfigurationBuilder().SetBasePath(env.ContentRootPath)
//                 .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
//             Configuration = builder.Build();
//             _applicationUrl = Configuration.GetSection("AppSettings").GetSection("General")["UserApplication"];

//         }

//         public IConfiguration Configuration { get; }

//         // This method gets called by the runtime. Use this method to add services to the container.
//         public void ConfigureServices(IServiceCollection services)
//         {
//             services.AddCors(options =>
//             {
//                 options.AddPolicy("corsapp",policy =>
//                 {
//                     policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("*");
//                 });
//             })
//             .Configure<ApplicationSettings>(Configuration.GetSection("AppSettings"))
//             .ConfigureSchematics<ApplicationSettings>(Configuration.GetSection("AppSettings"));

//             services.AddControllers();
//         }

//         // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
//         public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
//         {
//             if (env.IsDevelopment())
//             {
//                 app.UseDeveloperExceptionPage();
//             }

//             app.UseHttpsRedirection();
//             app.UseRouting();
//             app.UseCors("corsapp");
//             app.UseAuthorization();
//             app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
//         }
//     }
// }