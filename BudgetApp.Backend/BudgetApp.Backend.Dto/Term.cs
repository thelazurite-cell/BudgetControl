using System;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using BudgetApp.Backend.Dto.Interfaces;

namespace BudgetApp.Backend.Dto
{
    [TransferableDataType]
    public class Term : DataTransferObject
    {
        [JsonPropertyName("name")] public string Name { get; set; }
        [JsonPropertyName("startDay")] public int StartDay { get; set; }
        [JsonPropertyName("endDay")] public int EndDay { get; set; }
        [JsonPropertyName("startFrom")] public DateTime StartFrom { get; set; }
        [JsonPropertyName("expiryDate")] public DateTime? ExpiryDate { get; set; }
        [JsonPropertyName("baseIncome")] public decimal BaseIncome { get; set; }

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