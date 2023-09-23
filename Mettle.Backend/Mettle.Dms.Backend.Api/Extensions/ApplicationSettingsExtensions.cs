using BudgetApp.Backend.Api.Configuration;
using Microsoft.Extensions.Options;

namespace BudgetApp.Backend.Api.Extensions
{
    public static class ApplicationSettingsExtensions
    {
        public static IOptions<ApplicationSettings> ToIOptions(this ApplicationSettings applicationSettings)
        {
            return new OptionsWrapper<ApplicationSettings>(applicationSettings);
        }
    }
}
