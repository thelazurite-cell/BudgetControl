using System;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using BudgetApp.Backend.Dto.Interfaces;
using MongoDB.Bson.Serialization.Attributes;

namespace BudgetApp.Backend.Dto
{
    [TransferableDataType]
    public class Exception:DataTransferObject
    {
        [BsonElement("outgoingId")]
        [JsonPropertyName("outgoingId")]
        public string OutgoingId { get; set; }
        [BsonElement("costModifier")]
        [JsonPropertyName("costModifier")]
        public bool CostModifier { get; set; }
        [BsonElement("startFrom")]
        [JsonPropertyName("startFrom")]
        public DateTime StartFrom { get; set; }
        [BsonElement("expiryDate")]
        [JsonPropertyName("expiryDate")]
        public DateTime? ExpiryDate { get; set; }
        [BsonElement("costAmount")]
        [JsonPropertyName("costAmount")]
        public decimal CostAmount { get; set; }
        [BsonElement("reason")]
        [JsonPropertyName("reason")]
        public string Reason { get; set; }
        
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
            throw new NotImplementedException();
        }
    }
}