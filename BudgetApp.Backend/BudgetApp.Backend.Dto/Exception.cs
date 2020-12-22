using System;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using BudgetApp.Backend.Dto.Interfaces;

namespace BudgetApp.Backend.Dto
{
    [TransferrableDataType]
    public class Exception:DataTransferObject
    {
        [JsonPropertyName("outgoingId")]
        public string OutgoingId { get; set; }
        [JsonPropertyName("costModifier")]
        public bool CostModifier { get; set; }
        [JsonPropertyName("startFrom")]
        public DateTime StartFrom { get; set; }
        [JsonPropertyName("expiryDate")]
        public DateTime? ExpiryDate { get; set; }
        [JsonPropertyName("costAmount")]
        public decimal CostAmount { get; set; }
        [JsonPropertyName("reason")]
        public string Reason { get; set; }
        
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
            throw new NotImplementedException();
        }
    }
}