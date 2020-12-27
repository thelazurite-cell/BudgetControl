using System;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using BudgetApp.Backend.Dto.Interfaces;
using MongoDB.Bson.Serialization.Attributes;

namespace BudgetApp.Backend.Dto
{
    [TransferableDataType]
    public class Category: DataTransferObject
    {
        //[BsonElement("id")] [JsonIgnore] private string id;
        [BsonElement("name")]
        [JsonPropertyName("name")]
        public string Name { get; set; }
        
        [BsonElement("color")]
        [JsonPropertyName("color")]
        public string Color { get; set; }
        
        [BsonElement("threshold")]
        [JsonPropertyName("threshold")]
        public decimal Threshold { get; set; }
        
        [BsonElement("togglePicker")]
        [JsonPropertyName("togglePicker")]
        public bool TogglePicker { get; set; }
        
        [BsonElement("isDarkColor")]
        [JsonPropertyName("isDarkColor")]
        public bool IsDarkColor { get; set; }
        
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