using System;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using BudgetApp.Backend.Dto.Interfaces;

namespace BudgetApp.Backend.Dto.Auth
{
    [TransferableDataType]
    public class User : DataTransferObject
    {
        [JsonPropertyName("username")]
        public string Username { get; set; }
        [JsonPropertyName("password")]
        public string Password { get; set; }
        [JsonPropertyName("salt")]
        public string Salt { get; set; }
        [JsonPropertyName("firstName")]
        public string FirstName { get; set; }
        [JsonPropertyName("lastName")]
        public string LastName { get; set; }
        [JsonPropertyName("email")]
        public string Email { get; set; }
        [JsonPropertyName("loginAttempts")]
        public int LoginAttempts { get; set; }
        [JsonPropertyName("lockedOut")]
        public bool LockedOut { get; set; }

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