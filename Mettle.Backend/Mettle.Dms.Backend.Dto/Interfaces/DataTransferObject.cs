using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BudgetApp.Backend.Dto.Interfaces
{
    public abstract class DataTransferObject : IDto
    {
        [BsonId()]
        [JsonIgnore]
        [DataHidden]
        public ObjectId Id { get; set; }

        [BsonIgnore]
        [JsonPropertyName("id")]
        [DataHidden]
        [DataSystemField]
        [DataType(DataTypeEnum.Id)]
        public string Identifier
        {
            get => Id.ToString();
        }

        [BsonElement("removable")]
        [JsonPropertyName("removable")]
        [DataSystemField]
        [DataHidden]
        public bool Removable { get; set; }

        // [BsonElement("isDeleted")]
        [BsonIgnore]
        [JsonPropertyName("isDeleted")]
        [DataSystemField]
        [DataHidden]
        public bool IsDeleted { get; set; }


        // [BsonElement("isDirty")]
        [BsonIgnore]
        [JsonPropertyName("isDirty")]
        [DataSystemField]
        [DataHidden]
        public bool IsDirty { get; set; }

        [BsonIgnore][JsonIgnore] public RequestReport ValidationErrors { get; set; } = new();

        [BsonIgnore]
        [JsonExtensionData]
        [DataSystemField]
        [JsonPropertyName("additionalData")]
        [DataHidden]
        public Dictionary<string, object> AdditionalData { get; set; } = new();

        public abstract bool ValidateInsert(params string[] args);
        public abstract bool ValidateUpdate(params string[] args);
        public abstract bool ValidateDelete(params string[] args);
    }
}