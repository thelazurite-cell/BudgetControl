using System;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using BudgetApp.Backend.Dto.Auth;

namespace BudgetApp.Backend.Api.Controllers
{
    public class AuthSuccessfulResult
    {
        [JsonPropertyName("success")] public bool Success { get; set; } = true;
        [JsonPropertyName("result")] public string Result { get; set; }

        public AuthSuccessfulResult(Token token)
        {
            var str = JsonSerializer.Serialize(token, token.GetType());
            Result = Convert.ToBase64String(Encoding.UTF8.GetBytes(str));
        }
    }
}