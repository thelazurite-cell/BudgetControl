import {IExpenseDto} from './interfaces/expense-dto.interface';

export class Outgoing implements IExpenseDto {
  public categoryId: string;
  public cost: number;
  public _id: string;
  public name: string;
  public quantity: number;
  public payOnDay: number;
  removable: boolean;
  isDirty: boolean;
  isDeleted: boolean;
}
