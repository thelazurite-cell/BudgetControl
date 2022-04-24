import { Service } from "../../util/Service";
import { DataTransfer } from "../../api/DataTransfer";
import { Query } from "../../api/data-query/query";
import { QueryGroup } from "../../api/data-query/query-group";
import { FilterTypeEnum } from "../../api/data-query/filter-type.enum";

export class DataService extends Service {
  static schemaCache = [];
  static authToken = "";

  static _init = (function () {
    DataService.serviceName = "onDataUpdate";
    Service.init(DataService);
  })();

  static setAuthToken(authToken) {
    this.authToken = authToken;
  }

  static fetchSchema(schemaName) {
    if (!this.schemaCache[schemaName]) {
      const schemaQueryGroup = new QueryGroup();
      const schemaQuery = new Query();
      schemaQuery.fieldName = "schemaName";
      schemaQuery.comparisonType = FilterTypeEnum.equals;
      schemaQuery.fieldValue.push(schemaName);
      schemaQueryGroup.queries.push(schemaQuery);

      const api = new DataTransfer(this.authToken);
      api.find(
        "Schema",
        schemaQueryGroup,
        (res) => {
          const schema = res.data.pop();
          this.schemaCache[schemaName] = {
            schema: undefined,
            headers: undefined,
            data: undefined,
          };
          this.schemaCache[schemaName].schema = schema;
          this.schemaCache[schemaName].headers = schema.fields
            .map((itm) => {
              if (!itm.fieldHidden) {
                return {
                  key: itm.fieldName,
                  header: itm.fieldFriendlyName || itm.fieldName,
                };
              }
              return null;
            })
            .filter((itm) => itm != null);
          this.schemaCache.data = null;
          document.dispatchEvent(DataService.onServiceEvent);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  static fetchAll(schemaName) {
    if (this.schemaCache[schemaName]) {
      const api = new DataTransfer(this.authToken);
      api.findAll(
        schemaName,
        (res) => {
          // console.log("fetchall", res);
          this.schemaCache[schemaName].data = res.data;
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }
}
