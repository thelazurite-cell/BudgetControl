using System.Collections.Generic;
using System.Text.Json.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BudgetApp.Backend.Dto.Interfaces
{
    public interface IDto
    {
        [BsonId()]
        [JsonIgnore]
        ObjectId Id { get; set; }

        [BsonIgnore]
        [JsonPropertyName("id")]
        string Identifier
        {
            get => Id.ToString();
        }

        [BsonElement("removable")]
        [JsonPropertyName("removable")]
        [DataSystemField]
        bool Removable { get; set; }

        [BsonElement("isDeleted")]
        [JsonPropertyName("isDeleted")]
        [DataSystemField]
        bool IsDeleted { get; set; }

        [BsonIgnore]
        [JsonPropertyName("isDirty")]
        [DataHidden]
        [DataSystemField]
        bool IsDirty { get; set; }

        [BsonIgnore]
        [JsonExtensionData]
        [JsonPropertyName("additionalData")]
        [DataSystemField]
        Dictionary<string, object> AdditionalData { get; set; }
    }
}