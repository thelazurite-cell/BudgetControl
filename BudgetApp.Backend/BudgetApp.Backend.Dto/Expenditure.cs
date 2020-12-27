using System;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using BudgetApp.Backend.Dto.Interfaces;
using MongoDB.Bson.Serialization.Attributes;

namespace BudgetApp.Backend.Dto
{
    [TransferableDataType]
    public class Expenditure : ExpenseDto
    {
        [BsonElement("date")][JsonPropertyName("date")] public DateTime Date { get; set; }
        [BsonElement("amountSpent")][JsonPropertyName("amountSpent")] public decimal AmountSpent { get; set; }
        [BsonElement("outgoingId")][JsonPropertyName("outgoingId")] public string OutgoingId { get; set; }
        [BsonElement("periodId")][JsonPropertyName("periodId")] public string PeriodId { get; set; }
        [BsonElement("paid")][JsonPropertyName("paid")] public bool Paid { get; set; }
        [BsonElement("dueDate")][JsonPropertyName("dueDate")] public DateTime DueDate { get; set; }
        [BsonElement("notes")][JsonPropertyName("notes")] public string Notes { get; set; }

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