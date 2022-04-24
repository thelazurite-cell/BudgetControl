import {IDataTransferObject} from './interfaces/data-transfer-object.interface';

export class Exception implements IDataTransferObject {
  sanitize(): void {
    this.costAmount = +this.costAmount;
  }
  public _id: string;
  public outgoingId: string;
  public costModifier: boolean;
  public costAmount: number;
  public reason: string;
  public startFrom: Date;
  public expiryDate: Date | null = new Date();
  removable: boolean;
  isDirty: boolean;
  isDeleted: boolean;
}
