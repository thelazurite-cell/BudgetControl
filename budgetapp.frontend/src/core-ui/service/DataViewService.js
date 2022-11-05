import { Service } from "../../util/Service";
import { DataTransfer } from "../../api/DataTransfer";
import { Query } from "../../api/data-query/query";
import { QueryGroup } from "../../api/data-query/query-group";
import { FilterTypeEnum } from "../../api/data-query/filter-type.enum";

export class DataViewService extends Service {
  static viewTypes = [];

  static _init = (function () {
    DataViewService.serviceName = "onFetchviewType";
    Service.init(DataViewService);
  })();

  static getViewType(authToken, schemaName) {
    if (!this.viewTypes[schemaName]) {
      const schemaQueryGroup = new QueryGroup();
      const schemaQuery = new Query();
      schemaQuery.fieldName = "schemaName";
      schemaQuery.comparisonType = FilterTypeEnum.equals;
      schemaQuery.fieldValue.push(schemaName);
      schemaQueryGroup.queries.push(schemaQuery);

      const api = new DataTransfer(authToken);

      api.find(
        "Schema",
        schemaQueryGroup,
        (res) => {
          const schema = res.data.pop();
          this.viewTypes[schemaName] = {
            viewType: null,
          };

          this.viewTypes[schemaName].viewType = schema.viewType;

          document.dispatchEvent(DataViewService.onServiceEvent);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }
}
