using System;
using System.Globalization;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using BudgetApp.Backend.Dto.Interfaces;
using MongoDB.Bson.Serialization.Attributes;

namespace BudgetApp.Backend.Dto
{
    [TransferableDataType]
    public class Term : DataTransferObject
    {
        [BsonElement("name")]
        [JsonPropertyName("name")]
        public string Name { get; set; }

        [BsonElement("startDay")]
        [JsonPropertyName("startDay")]
        public int StartDay { get; set; }

        [BsonElement("endDay")]
        [JsonPropertyName("endDay")]
        public int EndDay { get; set; }

        [BsonElement("startFrom")]
        [JsonPropertyName("startFrom")]
        public DateTime StartFrom { get; set; }

        [BsonElement("expiryDate")] [JsonIgnore]
        private string _expiryDate;

        [JsonPropertyName("expiryDate")]
        [BsonIgnore]
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
        public decimal BaseIncome { get; set; }

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