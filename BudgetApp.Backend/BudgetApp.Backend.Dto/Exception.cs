using System;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using BudgetApp.Backend.Dto.Interfaces;
using MongoDB.Bson.Serialization.Attributes;

namespace BudgetApp.Backend.Dto
{
    [TransferableDataType]
    [DataSchema]
    public class Exception : DataTransferObject
    {
        [BsonElement("outgoingId")]
        [JsonPropertyName("outgoingId")]
        [DataType(DataTypeEnum.RelatedId)]
        [DataFriendlyName("Outgoing")]
        [DataRelatesTo("Outgoing")]
        public string OutgoingId { get; set; }

        [BsonElement("costModifier")]
        [JsonPropertyName("costModifier")]
        [DataType(DataTypeEnum.Boolean)]
        [DataFriendlyName("Cost Modifier")]
        public bool CostModifier { get; set; }

        [BsonElement("startFrom")]
        [JsonPropertyName("startFrom")]
        [DataType(DataTypeEnum.DateTime)]
        [DataFriendlyName("Starts From")]
        public DateTime StartFrom { get; set; }

        [BsonElement("expiryDate")]
        [JsonPropertyName("expiryDate")]
        [DataType(DataTypeEnum.DateTime)]
        [DataFriendlyName("Expiry Date")]
        public DateTime? ExpiryDate { get; set; }

        [BsonElement("costAmount")]
        [JsonPropertyName("costAmount")]
        [DataType(DataTypeEnum.Number)]
        [DataFriendlyName("Cost Amount")]
        [DataSensitive]
        public decimal CostAmount { get; set; }

        [BsonElement("reason")]
        [JsonPropertyName("reason")]
        [DataType(DataTypeEnum.String)]
        [DataFriendlyName("Reason")]
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