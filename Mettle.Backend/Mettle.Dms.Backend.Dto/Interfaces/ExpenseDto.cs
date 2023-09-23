using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using MongoDB.Bson.Serialization.Attributes;

namespace BudgetApp.Backend.Dto.Interfaces
{
    public abstract class ExpenseDto : DataTransferObject
    {
        [BsonElement("name")]
        [JsonPropertyName("name")]
        [DataFriendlyName("Name")]
        [DataType(DataTypeEnum.String)]
        [DataRelationshipView]
        public string Name { get; set; }

        [BsonElement("cost")]
        [JsonPropertyName("cost")]
        [DataFriendlyName("Cost")]
        [DataType(DataTypeEnum.Number)]
        [DataSensitive]
        public decimal Cost { get; set; }

        [BsonElement("quantity")]
        [JsonPropertyName("quantity")]
        [DataFriendlyName("Quantity")]
        [DataType(DataTypeEnum.Number)]
        [DataWholeNumber]
        public int Quantity { get; set; }

        [BsonElement("categoryId")]
        [JsonPropertyName("categoryId")]
        [DataFriendlyName("Category")]
        [DataRelatesTo("Category")]
        [DataType(DataTypeEnum.Id)]
        [DataRequired]
        public string CategoryId { get; set; }

    }
}