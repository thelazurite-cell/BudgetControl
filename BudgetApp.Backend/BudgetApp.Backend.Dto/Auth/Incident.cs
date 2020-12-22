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
        [JsonPropertyName("parameters")] public List<String> Parameters { get; set; }
        
        public override Boolean ValidateInsert(params String[] args)
        {
            throw new NotImplementedException();
        }

        public override Boolean ValidateUpdate(params String[] args)
        {
            throw new NotImplementedException();
        }

        public override Boolean ValidateDelete(params String[] args)
        {
            ValidationErrors.Add("Cannot delete an incident");
            return false;
        }
    }
}