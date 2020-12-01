import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogService} from '../../services/dialog.service';
import {Outgoing} from '../../classes/dto/outgoing';
import {Term} from '../../classes/dto/term';
import {DialogModel} from '../../dialog/dialog/dialog-model';
import {TableHeader} from '../../services/table.header';
import {KeyValuePair} from '../../services/table';
import {BaseTableService} from '../../services/base-table.service';
import {DropdownService} from '../../dropdown.service';
import {IDataTransferObject} from '../../classes/dto/interfaces/data-transfer-object.interface';

@Component({
  selector: 'app-add-outgoing-dialog',
  templateUrl: './add-outgoing-dialog.component.html',
  styleUrls: ['./add-outgoing-dialog.component.scss']
})
export class AddOutgoingDialogComponent implements OnInit {
  @Output() public static addRecord: EventEmitter<IDataTransferObject> = new EventEmitter<IDataTransferObject>();
  public outgoingsForm = this.fb.group({
    name: ['', Validators.required],
    cost: ['', Validators.required],
    quantity: ['', Validators.required],
    payOnDay: ['', Validators.required],
    categoryId: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddOutgoingDialogComponent>,
    private dialogService: DialogService,
    private dropDownService: DropdownService
  ) {
  }

  ngOnInit(): void {
  }

  abortAdd() {
    this.dialogRef.close();
  }

  addRecord() {
    if (this.outgoingsForm.valid) {
      const outgoing = new Outgoing();
      const form = this.outgoingsForm.controls;
      outgoing.name = form.name.value;
      outgoing.cost = Number(form.cost.value);
      outgoing.quantity = Number(form.quantity.value);
      outgoing.payOnDay = Number(form.payOnDay.value);
      outgoing.categoryId = form.categoryId.value;
      AddOutgoingDialogComponent.addRecord.emit(outgoing);
      this.dialogRef.close();
    } else {
      this.dialogService.showDialog(new DialogModel('Error', 'Term Form must be valid before submitting'), ['Ok']);
    }
  }

  getColor() {
    const currentId = 'categoryId';
    let options = this.dropDownService.getDropDownOptions(currentId);

    options = options.filter(itm => itm.key === this.outgoingsForm.controls.categoryId.value);
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

  getIsDarkColor() {
    let options = this.dropDownService.getDropDownOptions('categoryId');
    options = options.filter(itm => itm.key === this.outgoingsForm.controls.categoryId.value);
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

  public getDropDownOptions(backingField) {
    return this.dropDownService.getDropDownOptions(backingField);
  }
}
