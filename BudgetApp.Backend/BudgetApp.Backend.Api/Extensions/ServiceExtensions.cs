using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using BudgetApp.Backend.Api.Configuration;
using BudgetApp.Backend.Api.Services;
using BudgetApp.Backend.Dto;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Text.Json.Serialization;
using BudgetApp.Backend.Dto.Filtering;

namespace BudgetApp.Backend.Api.Extensions
{
    public static class DtoSchematics
    {
        /// <summary>
        /// Configures the available CRM Schematics for the service
        /// </summary>
        public static IServiceCollection ConfigureSchematics<TOptions>(this IServiceCollection services, IConfiguration config) where TOptions : class
        {
            var manager = new MongoManager(CreateApplicationConfig(config).ToIOptions());
            DeleteCodeFirstSchemas(manager);

            var schemas = GetSchemaDefinitions(manager.Schemas);
            InsertCodeFirstSchemas(manager, schemas);

            return services;
        }

        private static void InsertCodeFirstSchemas(MongoManager manager, List<Schema> schemas)
        {
            Console.WriteLine(schemas.Count());

            foreach (var schema in schemas)
            {
                var report = manager.Insert("Schema", typeof(Schema), schema);

                if (report.IsSuccess)
                {
                    Console.WriteLine($"Successfully Inserted Schema for: {schema.SchemaName}");
                }
                else
                {
                    Console.WriteLine($"Error Inserting Schema for: {schema.SchemaName}");
                }
            }
        }

        private static void DeleteCodeFirstSchemas(MongoManager manager)
        {
            var query = new QueryBuilder(typeof(Schema)).CreateAQuery().WhereField("isCodeFirst").Equals("true").Build();
            var schemas = manager.Find("Schema", typeof(Schema), query) as List<Schema>;

            foreach (var schema in schemas)
            {
                var deleteQuery = new QueryBuilder(typeof(Schema)).ById(schema.Identifier);
                var deleteReport = manager.Delete("Schema", typeof(Schema), deleteQuery.Build());
            }
        }

        private static List<Schema> GetSchemaDefinitions(List<Type> types)
        {
            var schemas = new List<Schema>();

            foreach (var type in types)
            {
                var schema = new Schema();
                schema.SchemaName = type.Name;
                schema.CodeFirst = true;
                schema.Expandable = Attribute.GetCustomAttributes(type).Any(attribute => attribute.GetType().Name == "DataSchemaExpandableAttribute");

                var viewTypeAttribute = Attribute.GetCustomAttributes(type)
                        .ToList()
                        .FirstOrDefault(attribute => attribute.GetType().Name == "ViewTypeAttribute");


                if (viewTypeAttribute != null)
                {
                    schema.ViewType = Enum.Parse<ViewTypeEnum>(
                        ReadAttributeValue(viewTypeAttribute).ToString()
                    );
                }

                Console.WriteLine($"\n\t <tbl> {type.Name} - Expandable: ${schema.Expandable} </tbl>");

                foreach (var property in type.GetProperties())
                {
                    var customAttributes = property.GetCustomAttributes();

                    if (!customAttributes.Any(attrib => attrib.GetType().Name == "JsonIgnoreAttribute"))
                    {
                        Console.WriteLine($"\t\t + {property.Name}");
                        var field = new SchemaField { FieldName = property.Name };

                        foreach (var attribute in customAttributes)
                        {
                            Console.WriteLine($"\t\t\t + {attribute.GetType().Name}");

                            SetValues(attribute, field);
                        }

                        if (field.FieldMaxLength == null && field.FieldType == DataTypeEnum.String)
                        {
                            field.FieldMaxLength = 150;
                        }

                        if (field.FieldFriendlyName == null || field.FieldFriendlyName.Length == 0)
                        {
                            field.FieldFriendlyName = field.FieldName;
                        }

                        schema.Fields.Add(field);
                    }
                    else
                    {
                        Console.WriteLine($"\t\t - {property.Name} [Ignored]");
                    }
                }
                schemas.Add(schema);
            }

            return schemas;
        }

        private static void SetValues(Attribute attribute, SchemaField field)
        {
            switch (attribute.GetType().Name)
            {
                case "JsonPropertyNameAttribute":
                    field.FieldName = (attribute as JsonPropertyNameAttribute).Name;
                    break;
                case "DataTypeAttribute":
                    field.FieldType = Enum.Parse<DataTypeEnum>(ReadAttributeValue(attribute).ToString());
                    break;
                case "DataMaxLengthAttribute":
                    field.FieldMaxLength = int.Parse((ReadAttributeValue(attribute)).ToString());
                    break;
                case "DataMinLengthAttribute":
                    field.FieldMinLength = int.Parse((ReadAttributeValue(attribute)).ToString());
                    ReadAttributeValue(attribute);
                    break;
                case "DataValidatorAttribute":
                    field.FieldValidator = ReadAttributeValue(attribute).ToString();
                    break;
                case "DataRequiredAttribute":
                    field.FieldRequired = bool.Parse(ReadAttributeValue(attribute).ToString());
                    break;
                case "DataHiddenAttribute":
                    field.FieldHidden = bool.Parse(ReadAttributeValue(attribute).ToString());
                    break;
                case "DataFriendlyNameAttribute":
                    field.FieldFriendlyName = ReadAttributeValue(attribute).ToString();
                    break;
                case "DataRelatesToAttribute":
                    field.FieldRelatesTo = ReadAttributeValue(attribute).ToString();
                    break;
                case "DataPlaceholderAttribute":
                    field.FieldPlaceholder = ReadAttributeValue(attribute).ToString();
                    break;
                case "DataSensitiveAttribute":
                    field.FieldSensitive = bool.Parse(ReadAttributeValue(attribute).ToString());
                    break;
                case "DataWholeNumberAttribute":
                    field.WholeNumber = bool.Parse(ReadAttributeValue(attribute).ToString());
                    break;
                case "DataExpandableHeaderAttribute":
                    field.ExpandableHeader = bool.Parse(ReadAttributeValue(attribute).ToString());
                    break;
                case "DataExpandableDescriptionAttribute":
                    field.ExpandableDescription = bool.Parse(ReadAttributeValue(attribute).ToString());
                    break;
                case "DataRelationshipViewAttribute":
                    field.RelationshipView = bool.Parse(ReadAttributeValue(attribute).ToString());
                    break;
                case "DataRelationshipViewColorAttribute":
                    field.RelationshipViewColor = bool.Parse(ReadAttributeValue(attribute).ToString());
                    break;
                case "DataSystemFieldAttribute":
                    field.SystemField = bool.Parse(ReadAttributeValue(attribute).ToString());
                    break;
                case "CollectionFilterAttribute":
                    field.CollectionFilter = bool.Parse(ReadAttributeValue(attribute).ToString());
                    break;
                case "CollectionCloneAttribute":
                    field.CollectionClone = bool.Parse(ReadAttributeValue(attribute).ToString());
                    break;
                case "CollectionDefaultsFromAttribute":
                    field.CollectionDefaultsFrom = ReadAttributeValue(attribute).ToString();
                    break;
            }
        }

        private static object ReadAttributeValue(Attribute attribute)
        {
            var prop = attribute.GetType().GetProperty("Value");
            var val = prop.GetValue(attribute);
            Console.WriteLine($"\t\t\t\t> {val}");
            return val;
        }

        private static ApplicationSettings CreateApplicationConfig(IConfiguration config)
        {
            return new ApplicationSettings()
            {
                Database = CreateDatabaseConfig(config),
                General = CreateGeneralSettings(config)
            };
        }
        private static DatabaseSettings CreateDatabaseConfig(IConfiguration config)
        {
            return new DatabaseSettings()
            {
                Host = config.GetSection("Database").GetSection("Host").Value,
                Port = int.Parse(config.GetSection("Database").GetSection("Port").Value),
                DatabaseName = config.GetSection("Database").GetSection("DatabaseName").Value,
                UserName = config.GetSection("Database").GetSection("UserName").Value,
                Password = config.GetSection("Database").GetSection("Password").Value,
                AllowInsecureTls = bool.Parse(config.GetSection("Database").GetSection("AllowInsecureTls").Value ?? "false"),
                UsesAuthentication = bool.Parse(config.GetSection("Database").GetSection("UsesAuthentication").Value ?? "false"),
                UseTls = bool.Parse(config.GetSection("Database").GetSection("UseTls").Value ?? "false"),
                AuthenticationDatabaseName = config.GetSection("Database").GetSection("AuthenticationDatabaseName").Value,
                AuthenticationType = config.GetSection("Database").GetSection("AuthenticationType").Value,
            };
        }
        private static GeneralSettings CreateGeneralSettings(IConfiguration config)
        {
            return new GeneralSettings()
            {
                UserApplication = config.GetSection("General").GetSection("UserApplication").Value,
                AdminEmail = config.GetSection("General").GetSection("AdminEmail").Value,
                MaxGuesses = int.Parse(config.GetSection("General").GetSection("MaxGuesses").Value),
                TokenExpiryMinutes = int.Parse(config.GetSection("General").GetSection("TokenExpiryMinutes").Value ?? "60"),
                HumanReadableJson = bool.Parse(config.GetSection("General").GetSection("HumanReadableJson").Value ?? "false"),
                DtoDllName = config.GetSection("General").GetSection("DtoDllName").Value,
            };
        }
    }
}
