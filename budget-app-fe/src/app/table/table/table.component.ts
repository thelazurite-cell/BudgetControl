import {AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnInit} from '@angular/core';
import {TableCell} from '../../services/table.cell';
import {KeyValuePair, Table, DropDownList, CustomAction} from '../../services/table';
import {DialogService} from '../../services/dialog.service';
import {DialogModel} from '../../dialog/dialog/dialog-model';
import {DataTransferService} from '../../services/data-transfer.service';
import {INamedDto} from '../../classes/dto/interfaces/expense-dto.interface';
import {TableHeader} from '../../services/table.header';
import {BaseTableService} from '../../services/base-table.service';
import {DropdownService} from '../../dropdown.service';
import {BehaviorSubject, Observable} from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements AfterViewInit, AfterViewChecked {

  constructor(private dialogService: DialogService, private dropDownService: DropdownService, public cdref: ChangeDetectorRef) {
    this.newHasData.next(this.table ? this.table.rows.length > 0 : false);
    this.tableBe.subscribe(next => {
      this.table = next;
      this.newHasData.next(this.table ? this.table.rows.length > 0 : false);
      this.cdref.markForCheck();
      // this.cdref.detectChanges();
    });
  }

  public get displayedColumns(): string[] {
    const columns = this.table.columns;
    if (!this.table.options.readOnly) {
      columns.push('test');
    }
    return columns;
  }

  public addCallback: EventEmitter<any> = new EventEmitter<any>();
  public tableBe: BehaviorSubject<Table> = new BehaviorSubject<Table>(null);
  public newHasData: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public tableSubject: BehaviorSubject<Table> = new BehaviorSubject(new Table());

  public set table(value: Table) {
    this.tableSubject.next(value);
  }
  public get table(): Table {
    return this.tableSubject.getValue();
  }

  public getDropDownOptions(backingField) {
    return this.dropDownService.getDropDownOptions(backingField);
  }

  public hasData(): boolean {
    try {
      if (this.table) {
        this.cdref.markForCheck();
        return this.table.rows.length > 0;
      }
      return false;
    } catch {
      return false;
    }
  }

  public getCellValue(cell: TableCell) {
    if (cell.value != null && cell.value !== undefined) {
      return cell.value;
    }
    return ' ';
  }

  sendAddCb() {
    this.addCallback.emit(this.table.type);
  }

  onDeleteRow(row) {
    if (row.source._id.toString().trim().length > 0) {
      this.dialogService.selection.subscribe((value) => {
        if (value === 'Yes') {
          this.table.deleteRow(row);
        }
      });
      this.dialogService.showDialog(
        new DialogModel(
          'Confirm Deletion',
          `Are you sure you wish to delete this ${this.table.type}?`),
        ['Yes', 'No']);
    } else {
      this.table.deleteRow(row);
    }
  }

  getColor(element, header: TableHeader) {
    const currentId = this.table.getCellByHeaderName(element, header.heading).value;
    let options = this.getDropDownOptions(header.backgroundField);

    options = options.filter(itm => itm.key === currentId);
    if (options) {
      if (options.length > 0) {
        const item: KeyValuePair = options[0];
        if (item) {
          if (item.value.color) {
            return item.value.color;
          }
        }
      }
    }
    return 'none';
  }

  getIsDarkColor(element, header: TableHeader) {
    const currentId = this.table.getCellByHeaderName(element, header.heading).value;
    let options = this.getDropDownOptions(header.backgroundField);

    options = options.filter(itm => itm.key === currentId);
    if (options) {
      if (options.length > 0) {
        const item: KeyValuePair = options[0];
        if (item) {
          if (item.value.isDarkColor) {
            return item.value.isDarkColor;
          }
        }
      }
    }
    return false;
  }

  getHeading(header: TableHeader) {
    if (header) {
      if (header.heading) {
        return header.heading;
      }
    }
    return '';
  }

  getBackgroundField(header: TableHeader) {
    if (header) {
      if (header.backgroundField) {
        return header.backgroundField;
      }
    }
    return '';
  }

  isReadOnly() {
    if (this.table) {
      if (this.table.options) {
        return this.table.options.readOnly;
      }
    }
    return false;
  }

  hasFooterFields() {
    if (!this.table) {
      return false;
    }
    if (!this.table.options) {
      return false;
    }
    if (!this.table.options.sumFields) {
      return false;
    }
    return this.table.options.sumFields.length > 0;
  }

  runCustom(action: CustomAction, element) {
    action.customAction(null, element);
  }

  ngAfterViewInit(): void {
    this.cdref.detectChanges();
  }

  ngAfterViewChecked(): void {
    this.newHasData.next(this.table ? this.table.rows.length > 0 : false);

    this.cdref.detectChanges();
  }
}
