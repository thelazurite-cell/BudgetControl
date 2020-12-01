import {IComparableItem} from "./interfaces/comparable-item.interface";
import {FilterTypeEnum} from "./filter-type.enum";

export class Query implements IComparableItem {
  public fieldName: string = "";
  public fieldValue: string = "";
  public comparisonType: FilterTypeEnum = FilterTypeEnum.none;
}

