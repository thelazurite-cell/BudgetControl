using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using BudgetApp.Backend.Dto.Interfaces;

namespace BudgetApp.Backend.Dto.Auth
{
    public class Incident: DataTransferObject
    {
        [JsonPropertyName("userId")] public string UserId { get; set; }
        [JsonPropertyName("remoteAddress")] public string RemoteAddress { get; set; }
        [JsonPropertyName("incidentType")] public IncidentType IncidentType { get; set; }
        [JsonPropertyName("incidentLevel")] public IncidentLevel IncidentLevel { get; set; }
        [JsonPropertyName("parameters")] public List<string> Parameters { get; set; }
        
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
                ErrorCode = ApiErrorCode.ItemCannotBeDeleted, Level = IncidentLevel.Error, MessageText = "An incident cannot be deleted"
            });
            return false;
        }
    }
}