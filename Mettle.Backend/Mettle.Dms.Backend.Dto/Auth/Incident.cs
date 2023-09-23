using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using BudgetApp.Backend.Dto.Interfaces;
using MongoDB.Bson.Serialization.Attributes;

namespace BudgetApp.Backend.Dto.Auth
{
    public class Incident : DataTransferObject
    {
        [BsonElement("userId")]
        [JsonPropertyName("userId")]
        public string UserId { get; set; }

        [BsonElement("remoteAddress")]
        [JsonPropertyName("remoteAddress")]
        public string RemoteAddress { get; set; }

        [BsonElement("incidentType")]
        [JsonPropertyName("incidentType")]
        public IncidentType IncidentType { get; set; }

        [BsonElement("incidentLevel")]
        [JsonPropertyName("incidentLevel")]
        public IncidentLevel IncidentLevel { get; set; }

        [BsonElement("parameters")]
        [JsonPropertyName("parameters")]
        public List<string> Parameters { get; set; }

        [BsonElement("timestamp")]
        [JsonPropertyName("timestamp")]
        public DateTime Timestamp { get; set; }

        public override bool ValidateInsert(params string[] args)
        {
            throw new NotImplementedException();
        }

        public override bool ValidateUpdate(params string[] args)
        {
            throw new NotImplementedException();
        }

        public override bool ValidateDelete(params string[] args)
        {
            this.ValidationErrors.Messages.Add(new Message
            {
                ErrorCode = ApiErrorCode.ItemCannotBeDeleted, Level = IncidentLevel.Error,
                MessageText = "An incident cannot be deleted"
            });
            return false;
        }
    }
}