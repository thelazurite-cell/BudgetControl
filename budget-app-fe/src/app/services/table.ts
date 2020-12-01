import {TableHeader} from './table.header';
import {GenerationOptions} from './generation.options';
import {TablePagination} from './table.pagination';
import {TableRow} from './table.row';
import {IDataTransferObject} from '../classes/dto/interfaces/data-transfer-object.interface';
import {IColor} from '../classes/dto/category';
import {ColorHelper} from '../setup-budgets/category-edit/category-edit.component';

export class KeyValuePair {
  public key: string;
  public value: any;

  constructor(key, value) {
    this.key = key;
    this.value = value;
  }
}

export class DropDownList {
  public backingField: string = '';
  public dropDownOptions: KeyValuePair[] = [];
}

export class CustomAction implements IColor {
  public label: string = '';
  public matIconName: string = '';
  public color: string = '#fefefe';
  public isDarkColor: boolean = false;
  public checkIsDisabled: (item: IDataTransferObject) => boolean = item => true;
  public customAction: ($event, element) => any = ($event, element) => {
    return;
  }
}

export class CustomActionBuilder {
  private static temp: CustomAction = new CustomAction();

  public static get and(): CustomActionBuilder {
    return this;
  }

  public static createAction(): CustomActionBuilder {
    this.temp = new CustomAction();
    return this;
  }

  public static withALabelOf(label: string): CustomActionBuilder {
    this.temp.label = label;
    return this;
  }

  public static withIcon(icon: string) {
    this.temp.matIconName = icon;
    return this;
  }

  public static withColor(color: string) {
    this.temp.color = color;
    ColorHelper.determineIfDark(this.temp, color);
    return this;
  }

  public static withDisableCheck(check: (item: IDataTransferObject) => boolean) {
    this.temp.checkIsDisabled = check;
    return this;
  }

  public static withCustomAction(action: ($event, item) => any) {
    this.temp.customAction = action;
    return this;
  }

  public static build() {
    return this.temp;
  }

  public withALabelOf(label: string) {
    return CustomActionBuilder.withALabelOf(label);
  }

  public withIcon(icon: string) {
    return CustomActionBuilder.withIcon(icon);
  }

  public withDisableCheck(check: (item: IDataTransferObject) => boolean) {
    return CustomActionBuilder.withDisableCheck(check);
  }

  public withCustomAction(action: ($event, item) => any) {
    return CustomActionBuilder.withCustomAction(action);
  }

  public withColor(color: string) {
    return CustomActionBuilder.withColor(color);
  }

  public build() {
    return CustomActionBuilder.build();
  }
}


export class Table {
  public isDirty: boolean = false;
  public headers: Array<TableHeader> = [];
  public rows: Array<TableRow> = [];
  public displayRows: Array<TableRow> = [];
  public pagination: TablePagination = new TablePagination();
  public type: string = '';
  public options: GenerationOptions = new GenerationOptions();

  public get columns() {
    return this.headers.map(x => x.heading);
  }

  public isDropDownField(header: TableHeader) {
    if (!header) {
      return false;
    }
    if (!header.backgroundField) {
      return false;
    }
    return header.backgroundField.endsWith('Id');
  }

  public getCellByHeaderName(row, header) {
    const ts = row.cells.filter(x => x.header.heading === header);
    if (ts.length > 0) {
      return ts[0];
    }

    return {value: ''};
  }

  public getColumnValues(header: string) {
    const values = [];
    for (let i = 0; i < this.displayRows.length; i++) {
      const row = this.displayRows[i];
      const cells = row.cells.filter(itm => itm.header.backgroundField === header);
      if (cells) {
        if (cells.length) {
          values.push(cells[0].value);
        }
      }
    }
    return values;
  }

  public sumValues(header: string) {
    console.log(header);
    const values = this.getColumnValues(header);
    return values.reduce((a, v) => a + Number(v), 0);
  }

  public hasSumColumn(header: string) {
    if (!this.options.sumFields) {
      return false;
    }
    return this.options.sumFields.filter(itm => itm === header).length > 0;
  }

  public deleteRow(row: TableRow) {
    const filter = this.rows.filter(r => r.source._id === row.source._id);
    if (filter) {
      filter[0].source.isDeleted = true;
    }
    console.log(this.rows);
    row.source.isDeleted = true;
    this.updateModel();
  }

  public subscribeAll() {
    for (let i = 0; i < this.displayRows.length; i++) {
      const item = this.displayRows[i];
      item.onChange.subscribe(value => {
        this.isDirty = true;
      });
    }
  }

  public unsubscribeAll() {
    for (let i = 0; i < this.displayRows.length; i++) {
      const item = this.displayRows[i];
      item.onChange.unsubscribe();
    }
  }

  public getNextPage() {
    if (this.nextIsDisabled) {
      return;
    }
    this.unsubscribeAll();
    this.pagination.currentPage++;
    this.updateModel();
    this.subscribeAll();
  }

  public getPreviousPage() {
    if (this.previousIsDisabled) {
      return;
    }
    this.unsubscribeAll();
    this.pagination.currentPage--;
    this.updateModel();
    this.subscribeAll();
  }

  public updateModel() {
    const start = this.pagination.getCurrentStart();
    const end = this.pagination.getEnd();
    console.log(start);
    console.log(end);
    this.displayRows = [];
    const tmp = [];
    for (let i = start; i < end; i++) {
        tmp.push(this.rows[i]);
    }
    this.displayRows = tmp;
    console.log(this.rows);
    console.log(tmp);
    console.log(this.displayRows);
  }

  public get nextIsDisabled(): boolean {
    return this.pagination.currentPage + 1 > this.pagination.pages;
  }

  public get previousIsDisabled(): boolean {
    return this.pagination.currentPage === 0;
  }

  constructor() {
    this.pagination.sizeChanged.subscribe(() => this.updateModel());
  }
}
