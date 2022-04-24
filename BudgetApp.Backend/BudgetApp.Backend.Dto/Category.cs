using System;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using BudgetApp.Backend.Dto.Interfaces;
using MongoDB.Bson.Serialization.Attributes;

namespace BudgetApp.Backend.Dto
{
    [TransferableDataType]
    [DataSchema]
    public class Category : DataTransferObject
    {
        //[BsonElement("id")] [JsonIgnore] private string id;
        [BsonElement("name")]
        [JsonPropertyName("name")]
        [DataFriendlyName("Name")]
        [DataType(DataTypeEnum.String)]
        [DataRelationshipView]
        [DataRequired]
        public string Name { get; set; }

        [BsonElement("color")]
        [JsonPropertyName("color")]
        [DataFriendlyName("Color")]
        [DataType(DataTypeEnum.Color)]
        [DataRelationshipViewColor]
        [DataRequired]
        public string Color { get; set; }

        [BsonElement("threshold")]
        [JsonPropertyName("threshold")]
        [DataFriendlyName("Threshold")]
        [DataType(DataTypeEnum.Number)]
        [DataRequired]
        [DataSensitive]
        public decimal Threshold { get; set; }

        // [BsonElement("togglePicker")]
        // [JsonPropertyName("togglePicker")]
        // [DataHidden]
        // [DataType(DataTypeEnum.Boolean)]
        // public bool TogglePicker { get; set; }

        // [BsonElement("isDarkColor")]
        // [JsonPropertyName("isDarkColor")]
        // [DataHidden]
        // [DataType(DataTypeEnum.Boolean)]
        // public bool IsDarkColor { get; set; }

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