using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using BudgetApp.Backend.Dto.Interfaces;
using MongoDB.Bson.Serialization.Attributes;

namespace BudgetApp.Backend.Dto
{
    [TransferableDataType]
    public class Schema : DataTransferObject
    {
        [BsonElement("schemaName")]
        [JsonPropertyName("schemaName")]
        public string SchemaName { get; set; }

        [BsonElement("fields")]
        [JsonPropertyName("fields")]
        public List<SchemaField> Fields { get; set; } = new List<SchemaField>();

        [BsonElement("isCodeFirst")]
        [JsonPropertyName("isCodeFirst")]
        public bool CodeFirst { get; set; } = false;

        [BsonElement("isExpandable")]
        [JsonPropertyName("isExpandable")]
        public bool Expandable { get; set; } = false;

        [BsonElement("viewType")]
        [JsonPropertyName("viewType")]
        public ViewTypeEnum ViewType { get; set; } = ViewTypeEnum.Table;


        public override bool ValidateDelete(params string[] args)
        {
            throw new NotImplementedException();
        }

        public override bool ValidateInsert(params string[] args)
        {
            throw new NotImplementedException();
        }

        public override bool ValidateUpdate(params string[] args)
        {
            throw new NotImplementedException();
        }
    }
}