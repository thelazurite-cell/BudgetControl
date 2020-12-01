import {IExpenseDto} from './interfaces/expense-dto.interface';

export class Expenditure implements IExpenseDto {
  public categoryId: string = '';
  public _id: string = '';
  public name: string = '';
  public quantity: number = 0;
  public cost: number = 0;
  public amountSpent: number = 0;
  public date: Date = new Date();
  public outgoingId: string = '';
  public periodId: string = '';
  public paid: boolean = true;
  public dueDate: Date = new Date();
  public notes: string = '';
  removable: boolean = true;
  isDirty: boolean = false;
  isDeleted: boolean = false;
}
