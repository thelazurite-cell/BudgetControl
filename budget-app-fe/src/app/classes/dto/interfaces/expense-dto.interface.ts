import {IDataTransferObject} from './data-transfer-object.interface';
export interface INamedDto extends IDataTransferObject {
  name: string;
}
export interface IExpenseDto extends INamedDto {
  cost: number;
  quantity: number;
  categoryId: string;
}
