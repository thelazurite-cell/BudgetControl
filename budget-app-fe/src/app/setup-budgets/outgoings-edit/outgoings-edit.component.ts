import {ChangeDetectorRef, Component, ComponentFactoryResolver, OnInit} from '@angular/core';
import {BaseTableService} from '../../services/base-table.service';
import {AddTermDialogComponent} from '../add-term-dialog/add-term-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {DataTransferService} from '../../services/data-transfer.service';
import {BaseTableComponent} from '../../table/base-table.component';
import {AddOutgoingDialogComponent} from '../add-outgoing-dialog/add-outgoing-dialog.component';
import {GenerationOptions} from '../../services/generation.options';
import {CustomActionBuilder} from '../../services/table';

@Component({
  selector: 'app-outgoings-edit',
  templateUrl: './outgoings-edit.component.html',
  styleUrls: ['./outgoings-edit.component.scss']
})
export class OutgoingsEditComponent extends BaseTableComponent {

  constructor(public dialog: MatDialog, public dataService: DataTransferService, public tableService: BaseTableService,
              public cdref: ChangeDetectorRef,protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super(
      'outgoing',
      AddOutgoingDialogComponent,
      dialog,
      dataService,
      tableService,
      cdref,
      new GenerationOptions(
        ['cost', 'quantity']
      ));
    if (OutgoingsEditComponent.isSubscribed == null) {
      OutgoingsEditComponent.isSubscribed = false;
    }
  }

  private static isSubscribed = null;

  get isAddRecordSubscribed(): boolean {
    return OutgoingsEditComponent.isSubscribed;
  }

  set isAddRecordSubscribed(value: boolean) {
    OutgoingsEditComponent.isSubscribed = true;
  }
}
