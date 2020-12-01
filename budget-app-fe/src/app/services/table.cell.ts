import {EventEmitter} from '@angular/core';
import {TableHeader} from './table.header';

export class TableCell {
  public valueType: string = '';
  public header: TableHeader = new TableHeader();

  public onChange: EventEmitter<any> = new EventEmitter();
  private _value: any = {};

  public get value() {
    return this._value;
  }

  public cellChange($event) {
    this.value = $event.target.value;
  }

  public set value(value: any) {
    this.onChange.emit({field: this.header, newValue: value, oldValue: this._value});
    this._value = value;
  }

  constructor(value: any, header: TableHeader) {
    this._value = value;
    this.header = header;
    this.valueType = typeof value;
  }
}
