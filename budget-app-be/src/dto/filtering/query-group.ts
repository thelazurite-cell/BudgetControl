import {IComparableItem} from "./interfaces/comparable-item.interface";
import {FilterTypeEnum} from "./filter-type.enum";

export class QueryGroup implements IComparableItem {
  public comparisonType: FilterTypeEnum = FilterTypeEnum.none;
  public queries: Array<IComparableItem> = [];
}
