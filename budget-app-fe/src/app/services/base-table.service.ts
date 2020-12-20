import {ChangeDetectorRef, ComponentFactoryResolver, ComponentRef, EventEmitter, Injectable, ViewContainerRef} from '@angular/core';
import {IDataTransferObject} from '../classes/dto/interfaces/data-transfer-object.interface';
import {TableComponent} from '../table/table/table.component';
import {Table} from './table';
import {GenerationOptions} from './generation.options';
import {AddEmitter} from './add.emitter';
import {TableRow} from './table.row';
import {TableCell} from './table.cell';
import {TableHeader} from './table.header';
import {DataTransferService} from './data-transfer.service';

@Injectable({
  providedIn: 'root'
})
export class BaseTableService {
  private componentReference: ComponentRef<TableComponent>;

  public add: EventEmitter<AddEmitter> = new EventEmitter<AddEmitter>();
  public addEmitters: AddEmitter[] = [];

  constructor(protected componentFactoryResolver: ComponentFactoryResolver) {
  }

  public createTable(
    items: Array<IDataTransferObject>,
    type: string,
    view: ViewContainerRef,
    generationOptions: GenerationOptions = new GenerationOptions()
  ): Table {
    const elements = this.addEmitters.filter(itm => itm.type === type);
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const index = this.addEmitters.indexOf(element);
      element.emitter.unsubscribe();
      this.addEmitters.slice(index, 1);
    }

    const table = this.generateTable(type, items, generationOptions);
    const component = this.resolveTable(view);
    const emitter = new AddEmitter();
    emitter.type = type;
    emitter.emitter = component.addCallback;
    component.addCallback.subscribe((dtoType: string) => this.sendCallBack(dtoType, emitter));
    this.addEmitters.push(emitter);
    component.table = table;
    return table;
  }

  private resolveTable(view: ViewContainerRef) {
    view.clear();
    const factory = this.componentFactoryResolver.resolveComponentFactory(TableComponent);
    this.componentReference = view.createComponent(factory);
    return (this.componentReference.instance as TableComponent);
  }

  private generateTable(type: string, items: Array<IDataTransferObject>, generationOptions: GenerationOptions): Table {
    const table = new Table();
    table.type = type;
    table.options = generationOptions;
    if (items) {
      if (items.length) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          this.createTableRow(item, table);
        }
      }
    }
    table.subscribeAll();
    return table;
  }

  public createTableRow(item: IDataTransferObject, table: Table) {
    const row = new TableRow();
    row.source = item;

    for (const key of Object.getOwnPropertyNames(item)) {
      if (table.options.hideColumns.indexOf(key) > -1) {
        continue;
      }
      const tableHeaders = table.headers.filter(itm => itm.backgroundField === key);
      let header;
      if (tableHeaders.length === 0) {
        let friendlyName = key.replace(/[^A-Za-z0-9]/g, '')
          .replace(/([A-Z]+)/g, ' $1').replace(/([A-Z][a-z])/g, ' $1');
        friendlyName = friendlyName[0].toUpperCase() + friendlyName.slice(1);
        header = new TableHeader();
        header.heading = friendlyName;
        header.backgroundField = key;
        table.headers.push(header);
      } else {
        header = tableHeaders[0];
      }
      const cell = new TableCell(item[key], header);
      row.cells.push(cell);
    }
    row.subscribeAll();
    table.rows.push(row);
    table.pagination.totalRows++;
    if (table.displayRows.length < table.pagination.pageSize || !table.options.hasPagination) {
      table.displayRows.push(row);
    }
  }

  private sendCallBack(type: any, emitter: AddEmitter) {
    if (emitter.type === type) {
      console.log('add emitting!');
      this.add.emit(emitter);
    }
  }
}
