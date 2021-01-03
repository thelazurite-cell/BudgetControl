import {FilterTypeEnum} from './filter-type.enum';
import {IComparableItem} from './interfaces/comparable-item.interface';

export class QueryGroup implements IComparableItem {
  typeDiscriminator: string = 'QueryGroup';
  public comparisonType: FilterTypeEnum = FilterTypeEnum.none;
  public queries: Array<IComparableItem> = [];
}
