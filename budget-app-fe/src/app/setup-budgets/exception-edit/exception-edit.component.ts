import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {DataTransferService} from '../../services/data-transfer.service';
import {BaseTableService} from '../../services/base-table.service';
import {AddTermDialogComponent} from '../add-term-dialog/add-term-dialog.component';
import {BaseTableComponent} from '../../table/base-table.component';
import {AddExceptionDialogComponent} from '../add-exception-dialog/add-exception-dialog.component';

@Component({
  selector: 'app-exception-edit',
  templateUrl: './exception-edit.component.html',
  styleUrls: ['./exception-edit.component.scss']
})
export class ExceptionEditComponent extends BaseTableComponent {
  constructor(public dialog: MatDialog, public dataService: DataTransferService, public tableService: BaseTableService) {
    super('exception', AddExceptionDialogComponent, dialog, dataService, tableService);
    if (ExceptionEditComponent.isSubscribed == null) {
      ExceptionEditComponent.isSubscribed = false;
    }
  }

  private static isSubscribed = null;

  get isAddRecordSubscribed(): boolean {
    return ExceptionEditComponent.isSubscribed;
  }

  set isAddRecordSubscribed(value: boolean) {
    ExceptionEditComponent.isSubscribed = value;
  }
}
