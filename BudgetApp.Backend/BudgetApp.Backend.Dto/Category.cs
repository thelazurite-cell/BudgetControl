using System;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using BudgetApp.Backend.Dto.Interfaces;

namespace BudgetApp.Backend.Dto
{
    [TransferableDataType]
    public class Category: DataTransferObject
    {
        [JsonPropertyName("name")]
        public string Name { get; set; }
        
        [JsonPropertyName("color")]
        public string Color { get; set; }
        
        [JsonPropertyName("threshold")]
        public decimal Threshold { get; set; }
        
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