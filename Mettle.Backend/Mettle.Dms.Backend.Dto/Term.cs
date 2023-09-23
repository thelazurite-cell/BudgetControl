using System;
using System.Globalization;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using BudgetApp.Backend.Dto.Interfaces;
using MongoDB.Bson.Serialization.Attributes;

namespace BudgetApp.Backend.Dto
{
    [ViewFriendlyName("Terms")]
    [ViewShown(true)]
    [TransferableDataType]
    [DataSchema]
    [DataSchemaExpandable]
    [ViewForceReload(true)]
    public class Term : DataTransferObject
    {
        [BsonElement("name")]
        [JsonPropertyName("name")]
        [DataType(DataTypeEnum.String)]
        [DataMaxLength(300)]
        [DataRequired]
        [DataFriendlyName("Name")]
        [DataRelationshipView]
        public string? Name { get; set; }

        [BsonElement("startDay")]
        [JsonPropertyName("startDay")]
        [DataFriendlyName("Start Day")]
        [DataType(DataTypeEnum.Number)]
        [DataRequired]
        [DataWholeNumber]
        public int StartDay { get; set; }

        [BsonElement("endDay")]
        [JsonPropertyName("endDay")]
        [DataFriendlyName("End Day")]
        [DataType(DataTypeEnum.Number)]
        [DataRequired]
        [DataWholeNumber]
        public int EndDay { get; set; }

        [BsonElement("startFrom")]
        [JsonPropertyName("startFrom")]
        [DataFriendlyName("Start From")]
        [DataType(DataTypeEnum.DateTime)]
        [DataRequired]
        public DateTime StartFrom { get; set; }

        [BsonElement("expiryDate")]
        [JsonIgnore]
        private string? _expiryDate;

        [BsonIgnore]
        [JsonPropertyName("expiryDate")]
        [DataFriendlyName("Expiry Date")]
        [DataType(DataTypeEnum.DateTime)]
        public DateTime? ExpiryDate
        {
            get
            {
                if (string.IsNullOrWhiteSpace(_expiryDate.Trim())) return null;
                return DateTime.Parse(_expiryDate, CultureInfo.InvariantCulture);
            }
            set
            {
                if (value != null) _expiryDate = value.Value.ToUniversalTime().ToString("s");
                else _expiryDate = string.Empty;
            }
        }

        [BsonElement("baseIncome")]
        [JsonPropertyName("baseIncome")]
        [DataFriendlyName("Base Income")]
        [DataType(DataTypeEnum.Number)]
        [DataRequired]
        [DataSensitive]
        public decimal BaseIncome { get; set; }

        [BsonElement("header")]
        [JsonPropertyName("header")]
        [DataFriendlyName("Header")]
        [DataType(DataTypeEnum.String)]
        [DataHidden]
        [DataRequired]
        [DataExpandableHeader]
        public string Header { get; set; }

        [BsonElement("description")]
        [JsonPropertyName("description")]
        [DataFriendlyName("Description")]
        [DataType(DataTypeEnum.String)]
        [DataHidden]
        [DataRequired]
        [DataExpandableDescription]
        public string Description { get; set; }

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