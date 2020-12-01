import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DataTransferService} from '../../services/data-transfer.service';
import {BaseTableService} from '../../services/base-table.service';
import {AddTermDialogComponent} from '../add-term-dialog/add-term-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {BaseTableComponent} from '../../table/base-table.component';
import {Term} from '../../classes/dto/term';

@Component({
  selector: 'app-term-edit',
  templateUrl: './term-edit.component.html',
  styleUrls: ['./term-edit.component.scss']
})
export class TermEditComponent extends BaseTableComponent implements OnInit, AfterViewInit {
  constructor(public dialog: MatDialog, public dataService: DataTransferService, public tableService: BaseTableService) {
    super('term', AddTermDialogComponent, dialog, dataService, tableService);
    if (TermEditComponent.isSubscribed == null) {
      TermEditComponent.isSubscribed = false;
    }
  }

  private static isSubscribed = null;

  get isAddRecordSubscribed(): boolean {
    return TermEditComponent.isSubscribed;
  }

  set isAddRecordSubscribed(value: boolean) {
    TermEditComponent.isSubscribed = true;
  }
}
