using System;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using BudgetApp.Backend.Dto.Interfaces;
using MongoDB.Bson.Serialization.Attributes;

namespace BudgetApp.Backend.Dto.Auth
{
    [TransferableDataType]
    [NoInsertFromApi]
    [NoUpdateFromApi]
    public class Token : DataTransferObject
    {
        [BsonElement("accessToken")]
        [JsonPropertyName("accessToken")]
        public string AccessToken { get; set; }

        [BsonElement("accessTokenExpiresAt")]
        [JsonPropertyName("accessTokenExpiresAt")]
        public DateTime AccessTokenExpiresAt { get; set; }

        [BsonElement("userId")]
        [JsonPropertyName("userId")]
        public string UserId { get; set; }

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

    public class NoInsertFromApiAttribute : Attribute
    {
    }

    public class NoUpdateFromApiAttribute : Attribute
    {
    }
}