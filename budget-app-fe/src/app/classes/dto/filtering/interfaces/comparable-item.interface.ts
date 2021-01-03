import {FilterTypeEnum} from '../filter-type.enum';

export interface IComparableItem {
  typeDiscriminator: string;
  comparisonType: FilterTypeEnum;
}
