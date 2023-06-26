namespace BudgetApp.Backend.Dto.Converters
{
    using System;
    using System.Globalization;
    using System.Text.Json;
    using System.Text.Json.Serialization;

    public class DecimalConverter : JsonConverter<decimal>
    {
        public override Decimal Read(
            ref Utf8JsonReader reader,
            Type typeToConvert,
            JsonSerializerOptions options)
        {
            var value = AttemptReadDecimal(reader) ?? AttemptReadInt(reader) ?? reader.GetString();

            return Decimal.Parse(value ?? string.Empty, CultureInfo.InvariantCulture);
        }

        private static string AttemptReadDecimal(Utf8JsonReader reader)
        {
            string value;
            try
            {
                return reader.GetDouble().ToString();
            }
            catch
            {
            }

            return null;
        }

        private static string AttemptReadInt(Utf8JsonReader reader)
        {
            string value;
            try
            {
                return reader.GetInt32().ToString();
            }
            catch
            {
            }

            return null;
        }

        public override void Write(
            Utf8JsonWriter writer,
            Decimal dateTimeValue,
            JsonSerializerOptions options) =>
            writer.WriteStringValue(dateTimeValue.ToString(CultureInfo.InvariantCulture));
    }

    public class FloatConverter : JsonConverter<float>
    {
        public override float Read(
            ref Utf8JsonReader reader,
            Type typeToConvert,
            JsonSerializerOptions options) =>
            float.Parse(reader.GetString() ?? string.Empty, CultureInfo.InvariantCulture);

        public override void Write(
            Utf8JsonWriter writer,
            float dateTimeValue,
            JsonSerializerOptions options) =>
            writer.WriteStringValue(dateTimeValue.ToString(CultureInfo.InvariantCulture));
    }

    public class DoubleConverter : JsonConverter<double>
    {
        public override double Read(
            ref Utf8JsonReader reader,
            Type typeToConvert,
            JsonSerializerOptions options) =>
            double.Parse(reader.GetString() ?? string.Empty, CultureInfo.InvariantCulture);

        public override void Write(
            Utf8JsonWriter writer,
            double dateTimeValue,
            JsonSerializerOptions options) =>
            writer.WriteStringValue(dateTimeValue.ToString(CultureInfo.InvariantCulture));
    }

    public class DateTimeConverter : JsonConverter<DateTime>
    {
        public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) 
            => DateTime.Parse(reader.GetString() ?? DateTime.UtcNow.ToString(CultureInfo.InvariantCulture), CultureInfo.InvariantCulture);

        public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToString(CultureInfo.InvariantCulture));
        }
    }
}