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
        public override Boolean ValidateInsert(params String[] args)
        {
            return true;
        }

        public override Boolean ValidateUpdate(params String[] args)
        {
            return true;
        }

        public override Boolean ValidateDelete(params String[] args)
        {
            return true;
        }
    }
}