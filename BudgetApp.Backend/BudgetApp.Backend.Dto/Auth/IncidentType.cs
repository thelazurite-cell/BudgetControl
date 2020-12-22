using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace BudgetApp.Backend.Dto.Auth
{
    public enum IncidentType
    {
        [JsonPropertyName("unknown")] Unknown,

        [JsonPropertyName("invalidCredentials")]
        InvalidCredentials,
        [JsonPropertyName("expiredToken")] ExpiredToken,
        [JsonPropertyName("invalidToken")] InvalidToken,
        [JsonPropertyName("login")] Login,
        [JsonPropertyName("lockedOut")] LockedOut
    }
}