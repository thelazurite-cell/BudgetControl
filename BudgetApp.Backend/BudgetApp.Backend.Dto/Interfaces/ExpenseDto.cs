using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using MongoDB.Bson.Serialization.Attributes;

namespace BudgetApp.Backend.Dto.Interfaces
{
    public abstract class ExpenseDto: DataTransferObject
    {
        [BsonElement("name")]
        [JsonPropertyName("name")]
        public string Name { get; set; }
        [BsonElement("cost")]
        [JsonPropertyName("cost")]
        public decimal Cost { get; set; }
        [BsonElement("quantity")]
        [JsonPropertyName("quantity")]
        public int Quantity { get; set; }
        [BsonElement("categoryId")]
        [JsonPropertyName("categoryId")]
        public string CategoryId { get; set; }

    }
}