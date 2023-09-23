using System;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using BudgetApp.Backend.Dto.Interfaces;
using MongoDB.Bson.Serialization.Attributes;

namespace BudgetApp.Backend.Dto.Auth
{
    [TransferableDataType]
    public class User : DataTransferObject
    {
        [BsonElement("username")]
        [JsonPropertyName("username")]
        public string Username { get; set; }

        [BsonElement("password")]
        [JsonPropertyName("password")]
        public string Password { get; set; }

        [BsonElement("salt")]
        [JsonPropertyName("salt")]
        public string Salt { get; set; }

        [BsonElement("firstName")]
        [JsonPropertyName("firstName")]
        public string FirstName { get; set; }

        [BsonElement("lastName")]
        [JsonPropertyName("lastName")]
        public string LastName { get; set; }

        [BsonElement("email")]
        [JsonPropertyName("email")]
        public string Email { get; set; }

        [BsonElement("loginAttempts")]
        [JsonPropertyName("loginAttempts")]
        public int LoginAttempts { get; set; }

        [BsonElement("lockedOut")]
        [JsonPropertyName("lockedOut")]
        public bool LockedOut { get; set; }

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