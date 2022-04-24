import {IExpenseDto} from './interfaces/expense-dto.interface';

export class Outgoing implements IExpenseDto {
  sanitize(): void {
    this.cost = +this.cost;
    this.payOnDay = +this.payOnDay;
    this.quantity = +this.quantity;
  }
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
