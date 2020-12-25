using System;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using BudgetApp.Backend.Dto.Interfaces;
using MongoDB.Bson.Serialization.Attributes;

namespace BudgetApp.Backend.Dto
{
    [TransferableDataType]
    public class Period : DataTransferObject
    {
        [BsonElement("name")]
        [JsonPropertyName("name")]
        public string Name { get; set; }

        [BsonElement("termId")]
        [JsonPropertyName("termId")]
        public string TermId { get; set; }

        [BsonElement("startsFrom")]
        [JsonPropertyName("startsFrom")]
        public DateTime StartsFrom { get; set; }

        [BsonElement("endsOn")]
        [JsonPropertyName("endsOn")]
        public DateTime EndsOn { get; set; }

        [BsonElement("income")]
        [JsonPropertyName("income")]
        public decimal Income { get; set; }

        [BsonElement("discrepancyReason")]
        [JsonPropertyName("discrepancyReason")]
        public string DiscrepancyReason { get; set; }

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