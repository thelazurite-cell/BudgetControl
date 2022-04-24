import {IDataTransferObject} from './interfaces/data-transfer-object.interface';
import {INamedDto} from './interfaces/expense-dto.interface';

export class Period implements INamedDto {
  sanitize(): void {
    this.income = +this.income;
  }
  public _id: string = '';
  public name: string = '';
  public termId: string = '';
  public startsFrom: Date = new Date();
  public endsOn: Date = new Date();
  public income: number = 0;
  public discrepancyReason: string = '';
  public isDeleted: boolean = false;
  public isDirty: boolean = false;
  public removable: boolean = true;
}
