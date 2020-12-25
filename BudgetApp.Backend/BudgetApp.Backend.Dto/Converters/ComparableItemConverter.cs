using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using BudgetApp.Backend.Dto.Interfaces;

namespace BudgetApp.Backend.Dto.Converters
{
    public class ComparableItemConverter<T> : JsonConverter<T> where T : ITypeDiscriminator
    {
        private readonly IEnumerable<Type> _types;

        public ComparableItemConverter()
        {
            var type = typeof(T);
            _types = AppDomain.CurrentDomain.GetAssemblies()
                .SelectMany(s => s.GetTypes())
                .Where(p => type.IsAssignableFrom(p) && p.IsClass && !p.IsAbstract)
                .ToList();
        }

        public override T Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType != JsonTokenType.StartObject)
            {
                throw new JsonException();
            }

            using var jsonDocument = JsonDocument.ParseValue(ref reader);
            if (!jsonDocument.RootElement.TryGetProperty("typeDiscriminator", out var typeProperty))
            {
                throw new JsonException();
            }

            var type = _types.FirstOrDefault(x => x.Name == typeProperty.GetString());
            if (type == null)
            {
                throw new JsonException();
            }

            var jsonObject = jsonDocument.RootElement.GetRawText();
            var opts = new JsonSerializerOptions();
            opts.Converters.Add(new ComparableItemConverter<IComparableItem>());
            var result = (T) JsonSerializer.Deserialize(jsonObject, type, opts);

            return result;
        }

        public override void Write(Utf8JsonWriter writer, T value, JsonSerializerOptions options)
        {
            JsonSerializer.Serialize(writer, (object)value, options);
        }
    }
}