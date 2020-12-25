using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace BudgetApp.Backend.Dto
{
    public class RequestReport
    {
        [JsonPropertyName("isSuccess")]
        public bool IsSuccess { get; set; }
        [JsonPropertyName("rowsAffected")]
        public int RowsAffected { get; set; }
        [JsonPropertyName("messages")]
        public List<Message> Messages { get; set; } = new List<Message>();
    }
}