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

        [BsonIgnore] public List<string> ValidationErrors { get; set; } = new List<String>();
        
        public abstract Boolean ValidateInsert(params String[] args);
        public abstract Boolean ValidateUpdate(params String[] args);
        public abstract Boolean ValidateDelete(params String[] args);
    }
}