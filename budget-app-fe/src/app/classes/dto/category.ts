import {IDataTransferObject} from './interfaces/data-transfer-object.interface';
import {INamedDto} from './interfaces/expense-dto.interface';

export interface IColor {
  color: string;
  isDarkColor: boolean;
}

export interface IColorDto extends INamedDto, IColor {

}

export class Category implements IColorDto {
  sanitize(): void {
    this.threshold = +this.threshold;
  }
  public _id: string;
  public name: string = '';
  public color: string = '#d6d2d2';
  public threshold: number = 0;
  public togglePicker: boolean = false;
  public isDarkColor: boolean = false;
  removable: boolean = true;
  isDirty: boolean;
  isDeleted: boolean;

}

