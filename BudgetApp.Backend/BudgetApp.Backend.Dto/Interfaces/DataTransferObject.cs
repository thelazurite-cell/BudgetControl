using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BudgetApp.Backend.Dto.Interfaces
{
    public abstract class DataTransferObject
    {
        [BsonId()]
        [JsonIgnore]
        public ObjectId Id { get; set; }
        
        [BsonIgnore]
        [JsonPropertyName("_id")]
        public  string Identifier
        {
            get => Id.ToString();
        }
        
        [BsonElement("removable")]
        [DataMember(Name= "removable")]
        public bool Removable { get; set; }
        
        [BsonElement("isDeleted")]
        [JsonPropertyName("isDeleted")]
        public bool IsDeleted { get; set; }
        [BsonElement("isDirty")]
        [JsonPropertyName("isDirty")]
        public bool IsDirty { get; set; }

        [BsonIgnore][JsonIgnore] public RequestReport ValidationErrors { get; set; } = new();
        
        public abstract bool ValidateInsert(params string[] args);
        public abstract bool ValidateUpdate(params string[] args);
        public abstract bool ValidateDelete(params string[] args);
    }
}