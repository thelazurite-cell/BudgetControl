import {IDataTransferObject} from '../classes/dto/interfaces/data-transfer-object.interface';
import {EventEmitter} from '@angular/core';
import {TableCell} from './table.cell';

export class TableRow {
  public source: IDataTransferObject;
  public cells: Array<TableCell> = [];
  public onChange: EventEmitter<any> = new EventEmitter();

  public subscribeAll() {
    for (let i = 0; i < this.cells.length; i++) {
      let item = this.cells[i];
      item.onChange.subscribe((value) => {
        this.source[value.field.backgroundField] = value.newValue;
        this.source.isDirty = true;
        this.onChange.emit({source: this.source._id});
      });
    }
  }
}
