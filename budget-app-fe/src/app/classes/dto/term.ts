import {IDataTransferObject} from './interfaces/data-transfer-object.interface';

export class Term implements IDataTransferObject {
  public _id: string;
  public name: string;
  public startDay: number;
  public endDay: number;
  public startFrom: Date;
  public expiryDate: Date | null = new Date();
  public baseIncome: number;
  removable: boolean = true;
  isDirty: boolean = false;
  isDeleted: boolean = false;
}

