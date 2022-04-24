using System.Text.Json.Serialization;
using MongoDB.Bson.Serialization.Attributes;

namespace BudgetApp.Backend.Dto
{
    public class SchemaField
    {
        [BsonElement("fieldName")]
        [JsonPropertyName("fieldName")]
        public string FieldName { get; set; } = "";

        [BsonElement("fieldType")]
        [JsonPropertyName("fieldType")]
        public DataTypeEnum? FieldType { get; set; } = DataTypeEnum.String;

        [BsonElement("fieldRequired")]
        [JsonPropertyName("fieldRequired")]
        public bool? FieldRequired { get; set; } = false;

        [BsonElement("fieldMaxLength")]
        [JsonPropertyName("fieldMaxLength")]
        public int? FieldMaxLength { get; set; }

        [BsonElement("fieldMinLength")]
        [JsonPropertyName("fieldMinLength")]
        public int? FieldMinLength { get; set; } = 0;

        [BsonElement("fieldValidator")]
        [JsonPropertyName("fieldValidator")]
        public string FieldValidator { get; set; } = "";

        [BsonElement("fieldFriendlyName")]
        [JsonPropertyName("fieldFriendlyName")]
        public string FieldFriendlyName { get; set; } = "";

        [BsonElement("fieldHidden")]
        [JsonPropertyName("fieldHidden")]
        public bool FieldHidden { get; set; } = false;

        [BsonElement("fieldRelatesTo")]
        [JsonPropertyName("fieldRelatesTo")]
        public string FieldRelatesTo { get; set; } = "";

        [BsonElement("fieldSensitive")]
        [JsonPropertyName("fieldSensitive")]
        public bool FieldSensitive { get; set; } = false;

        [BsonElement("wholeNumber")]
        [JsonPropertyName("wholeNumber")]
        public bool WholeNumber { get; set; } = false;

        [BsonElement("expandableHeader")]
        [JsonPropertyName("expandableHeader")]
        public bool ExpandableHeader { get; set; } = false;

        [BsonElement("expandableDescription")]
        [JsonPropertyName("expandableDescription")]
        public bool ExpandableDescription { get; set; } = false;

        [BsonElement("relationshipView")]
        [JsonPropertyName("relationshipView")]
        public bool RelationshipView { get; set; } = false;

        [BsonElement("relationshipViewColor")]
        [JsonPropertyName("relationshipViewColor")]
        public bool RelationshipViewColor { get; set; } = false;

        [BsonElement("systemField")]
        [JsonPropertyName("systemField")]
        public bool SystemField { get; set; } = false;
    }
}