using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace BudgetApp.Backend.Dto
{
    public class RequestReport
    {
        [JsonPropertyName("isSuccess")] public bool IsSuccess { get; set; }
        [JsonIgnore] public bool IsInternalError { get; set; }
        [JsonPropertyName("rowsAffected")] public int RowsAffected { get; set; }
        [JsonPropertyName("results")] public List<Object> Results { get; set; } = new List<Object>();
        [JsonPropertyName("messages")] public List<Message> Messages { get; set; } = new List<Message>();
    }
}