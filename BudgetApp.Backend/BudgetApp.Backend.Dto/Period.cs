using System;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using BudgetApp.Backend.Dto.Interfaces;
using MongoDB.Bson.Serialization.Attributes;

namespace BudgetApp.Backend.Dto
{
    [TransferableDataType]
    [DataSchema]

    public class Period : DataTransferObject
    {
        [BsonElement("name")]
        [JsonPropertyName("name")]
        [DataFriendlyName("Name")]
        [DataType(DataTypeEnum.String)]
        [DataRelationshipView]
        [DataRequired]
        public string Name { get; set; }

        [BsonElement("termId")]
        [JsonPropertyName("termId")]
        [DataFriendlyName("Name")]
        [DataType(DataTypeEnum.RelatedId)]
        [DataHidden]
        [DataRequired]
        [DataRelatesTo("Term")]
        public string TermId { get; set; }

        [BsonElement("startsFrom")]
        [JsonPropertyName("startsFrom")]
        [DataFriendlyName("Starts From")]
        [DataType(DataTypeEnum.DateTime)]
        [DataRequired]
        public DateTime StartsFrom { get; set; }

        [BsonElement("endsOn")]
        [JsonPropertyName("endsOn")]
        [DataFriendlyName("Ends On")]
        [DataType(DataTypeEnum.DateTime)]
        public DateTime? EndsOn { get; set; }

        [BsonElement("income")]
        [JsonPropertyName("income")]
        [DataFriendlyName("Income")]
        [DataType(DataTypeEnum.Number)]
        [DataRequired]
        public decimal Income { get; set; }

        [BsonElement("discrepancyReason")]
        [JsonPropertyName("discrepancyReason")]
        [DataFriendlyName("Discrepancy Reason")]
        [DataType(DataTypeEnum.String)]
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