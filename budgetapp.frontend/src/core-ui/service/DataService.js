import { Service } from "../../util/Service";
import { DataTransfer } from "../../api/DataTransfer";
import { Query } from "../../api/data-query/query";
import { QueryGroup } from "../../api/data-query/query-group";
import { FilterTypeEnum } from "../../api/data-query/filter-type.enum";
import { DataLoadingService } from "./DataLoadingService";

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

  static getInsertCacheName(schema) {
    return `${schema}_temp_insert`;
  }

  static getUpdateCacheName(schema) {
    return `${schema}_temp_update`;
  }

  static getDeleteCacheName(schema) {
    return `${schema}_temp_delete`;
  }

  static fetchSchema(schemaName, force = false) {
    if (force) {
      document.dispatchEvent(DataService.onServiceEvent);
    }

    if (!this.schemaCache[schemaName] || force) {
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
          const insertCache = JSON.parse(
            localStorage.getItem(DataService.getInsertCacheName(schemaName))
          );
          const updateCache = JSON.parse(
            localStorage.getItem(DataService.getUpdateCacheName(schemaName))
          );
          const deleteCache = JSON.parse(
            localStorage.getItem(DataService.getDeleteCacheName(schemaName))
          );
          this.schemaCache[schemaName] = {
            schema: undefined,
            headers: undefined,
            data: undefined,
            pendingCommits: {
              insert: insertCache ? insertCache : [],
              update: updateCache ? updateCache : [],
              delete: deleteCache ? deleteCache : [],
            },
            filter: undefined,
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

  static updateFilter(schemaName, filter) {
    this.schemaCache[schemaName].filter = filter;

    let group = new QueryGroup();
    // group.comparisonType = FilterTypeEnum.equals;
    let query = new Query();
    query.fieldName = filter.fieldName;
    query.fieldValue = [filter.fieldValue];
    query.comparisonType = FilterTypeEnum.equals;
    group.queries.push(query);
    console.log(group);
    DataService.fetchBy(schemaName, group);
  }

  static fetchBy(schemaName, query) {
    if (this.schemaCache[schemaName]) {
      const api = new DataTransfer(this.authToken);
      api.find(
        schemaName,
        query,
        (res) => {
          console.log(res);
          this.schemaCache[schemaName].data = res.data;
          setTimeout(() => {
            DataService.refresh();
          }, 1000);
        },
        (err) => {
          console.log(err);
          this.schemaCache[schemaName].data = [];
          setTimeout(() => {
            DataService.refresh();
          }, 1000);
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

  static refresh() {
    document.dispatchEvent(DataService.onServiceEvent);
  }
}
