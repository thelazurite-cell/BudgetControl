import {FilterTypeEnum} from './filter-type.enum';
import {IComparableItem} from './interfaces/comparable-item.interface';

export class Query implements IComparableItem {
  public fieldName: string;
  public fieldValue: string;
  public comparisonType: FilterTypeEnum;
}

