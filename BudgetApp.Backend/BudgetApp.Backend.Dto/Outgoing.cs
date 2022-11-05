using System;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using BudgetApp.Backend.Dto.Interfaces;
using MongoDB.Bson.Serialization.Attributes;

namespace BudgetApp.Backend.Dto
{
    [ViewFriendlyName("Outgoings")]
    [ViewShown(true)]
    [TransferableDataType]
    [DataSchema]
    [ViewForceReload(true)]
    public class Outgoing : ExpenseDto
    {
        [BsonElement("payOnDay")]
        [JsonPropertyName("payOnDay")]
        [DataFriendlyName("Pay On Day")]
        [DataType(DataTypeEnum.Number)]
        [DataRequired]
        [DataWholeNumber]
        public int PayOnDay { get; set; }

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