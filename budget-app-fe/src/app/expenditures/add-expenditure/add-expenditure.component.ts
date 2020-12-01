import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {IDataTransferObject} from '../../classes/dto/interfaces/data-transfer-object.interface';
import {FormBuilder, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogService} from '../../services/dialog.service';
import {DropdownService} from '../../dropdown.service';
import {Outgoing} from '../../classes/dto/outgoing';
import {DialogModel} from '../../dialog/dialog/dialog-model';
import {KeyValuePair} from '../../services/table';
import {Expenditure} from '../../classes/dto/expenditure';
import {StateService} from '../../state.service';

@Component({
  selector: 'app-add-expenditure',
  templateUrl: './add-expenditure.component.html',
  styleUrls: ['./add-expenditure.component.scss']
})
export class AddExpenditureComponent implements OnInit {
  @Output() public static addRecord: EventEmitter<IDataTransferObject> = new EventEmitter<IDataTransferObject>();
  public outgoingsForm = this.fb.group({
    name: ['', Validators.required],
    cost: ['', Validators.required],
    quantity: ['', Validators.required],
    paidOn: ['', Validators.required],
    categoryId: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddExpenditureComponent>,
    private dialogService: DialogService,
    private dropDownService: DropdownService,
    private periodService: StateService
  ) {
  }

  ngOnInit(): void {
  }

  abortAdd() {
    this.dialogRef.close();
  }

  addRecord() {
    if (this.outgoingsForm.valid) {
      const expenditure = new Expenditure();
      const form = this.outgoingsForm.controls;
      expenditure.name = form.name.value;
      expenditure.amountSpent = form.cost.value;
      expenditure.quantity = form.quantity.value;
      expenditure.date = form.paidOn.value;
      expenditure.categoryId = form.categoryId.value;
      expenditure.periodId = this.periodService.selectedPeriod.value;
      expenditure.paid = true;
      expenditure.cost = form.cost.value;
      AddExpenditureComponent.addRecord.emit(expenditure);
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
