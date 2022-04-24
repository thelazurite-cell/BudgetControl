using System;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using BudgetApp.Backend.Dto.Interfaces;
using MongoDB.Bson.Serialization.Attributes;

namespace BudgetApp.Backend.Dto
{
    [TransferableDataType]
    [DataSchema]

    public class Expenditure : ExpenseDto
    {
        [BsonElement("date")]
        [JsonPropertyName("date")]
        [DataFriendlyName("Date")]
        [DataType(DataTypeEnum.DateTime)]
        [DataRequired]
        public DateTime Date { get; set; }

        [BsonElement("amountSpent")]
        [JsonPropertyName("amountSpent")]
        [DataFriendlyName("Amount Spent")]
        [DataType(DataTypeEnum.Number)]
        [DataRequired]
        [DataSensitive]
        public decimal AmountSpent { get; set; }

        [BsonElement("outgoingId")]
        [JsonPropertyName("outgoingId")]
        [DataFriendlyName("Outgoing")]
        [DataRelatesTo("Outgoing")]
        [DataType(DataTypeEnum.Id)]
        [DataRequired]
        public string OutgoingId { get; set; }

        [BsonElement("periodId")]
        [JsonPropertyName("periodId")]
        [DataFriendlyName("Period")]
        [DataRelatesTo("Period")]
        [DataType(DataTypeEnum.Id)]
        [DataRequired]
        public string PeriodId { get; set; }

        [BsonElement("paid")]
        [JsonPropertyName("paid")]
        [DataFriendlyName("Paid")]
        [DataType(DataTypeEnum.Boolean)]
        [DataRequired]
        public bool Paid { get; set; } = false;

        [BsonElement("dueDate")]
        [JsonPropertyName("dueDate")]
        [DataFriendlyName("Due Date")]
        [DataType(DataTypeEnum.DateTime)]
        [DataRequired]
        public DateTime DueDate { get; set; }

        [BsonElement("notes")]
        [JsonPropertyName("notes")]
        [DataFriendlyName("Notes")]
        [DataType(DataTypeEnum.String)]
        public string Notes { get; set; }

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