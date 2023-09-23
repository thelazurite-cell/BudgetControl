import { FilterTypeEnum } from "./filter-type.enum";

export class QueryGroup {
  typeDiscriminator = "QueryGroup";
  comparisonType = FilterTypeEnum.none;
  queries = [];
}
