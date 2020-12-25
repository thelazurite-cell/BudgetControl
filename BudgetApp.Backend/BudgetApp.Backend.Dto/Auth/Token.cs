using System;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using BudgetApp.Backend.Dto.Interfaces;

namespace BudgetApp.Backend.Dto.Auth
{
    [TransferableDataType]
    public class Token : DataTransferObject
    {
        [JsonPropertyName("accessToken")] public string AccessToken { get; set; }

        [JsonPropertyName("accessTokenExpiresAt")]
        public string AccessTokenExpiresAt { get; set; }

        [JsonPropertyName("userId")] public string UserId { get; set; }
        public override bool ValidateInsert(params string[] args)
        {
            return true;
        }

        public override bool ValidateUpdate(params string[] args)
        {
            return true;
        }

        public override bool ValidateDelete(params string[] args)
        {
            return true;
        }
    }
}