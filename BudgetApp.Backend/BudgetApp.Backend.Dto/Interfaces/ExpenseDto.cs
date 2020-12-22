using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace BudgetApp.Backend.Dto.Interfaces
{
    public abstract class ExpenseDto: DataTransferObject
    {
        [JsonPropertyName("name")]
        public string Name { get; set; }
        [JsonPropertyName("cost")]
        public decimal Cost { get; set; }
        [JsonPropertyName("quantity")]
        public int Quantity { get; set; }
        [JsonPropertyName("categoryId")]
        public string CategoryId { get; set; }

    }
}