using System;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using BudgetApp.Backend.Dto.Interfaces;

namespace BudgetApp.Backend.Dto
{
    [TransferableDataType]
    public class Expenditure : ExpenseDto
    {
        [JsonPropertyName("date")] public DateTime Date { get; set; }
        [JsonPropertyName("amountSpent")] public decimal AmountSpent { get; set; }
        [JsonPropertyName("outgoingId")] public string OutgoingId { get; set; }
        [JsonPropertyName("periodId")] public string PeriodId { get; set; }
        [JsonPropertyName("paid")] public bool Paid { get; set; }
        [JsonPropertyName("dueDate")] public DateTime DueDate { get; set; }
        [JsonPropertyName("notes")] public string Notes { get; set; }

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