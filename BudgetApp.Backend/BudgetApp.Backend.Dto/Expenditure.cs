using System;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using BudgetApp.Backend.Dto.Interfaces;

namespace BudgetApp.Backend.Dto
{
    [TransferrableDataType]
    public class Expenditure : ExpenseDto
    {
        [JsonPropertyName("date")] public DateTime Date { get; set; }
        [JsonPropertyName("amountSpent")] public decimal AmountSpent { get; set; }
        [JsonPropertyName("outgoingId")] public string OutgoingId { get; set; }
        [JsonPropertyName("periodId")] public string PeriodId { get; set; }
        [JsonPropertyName("paid")] public bool Paid { get; set; }
        [JsonPropertyName("dueDate")] public DateTime DueDate { get; set; }
        [JsonPropertyName("notes")] public string Notes { get; set; }

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