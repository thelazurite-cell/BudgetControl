import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {StateService} from '../../state.service';
import {Expenditure} from '../../classes/dto/expenditure';
import {DialogModel} from '../../dialog/dialog/dialog-model';
import {FormBuilder, Validators} from '@angular/forms';
import {DialogService} from '../../services/dialog.service';
import {DataTransferService} from '../../services/data-transfer.service';

@Component({
  selector: 'app-pay-outgoing',
  templateUrl: './pay-outgoing.component.html',
  styleUrls: ['./pay-outgoing.component.scss']
})
export class PayOutgoingComponent implements OnInit {

  public currentExpenditure: Expenditure;
  public outgoingsForm = this.fb.group({
    amountPaid: ['', Validators.required],
  });
  public expectedValue: number;

  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<PayOutgoingComponent>,
    public stateService: StateService,
    private dialogService: DialogService,
    private dataService: DataTransferService) {
    this.currentExpenditure = stateService.currentExpenditure;
    if (this.currentExpenditure.amountSpent === 0) {
      this.outgoingsForm.controls.amountPaid.setValue(Number(this.currentExpenditure.cost));
    }
    this.expectedValue = Number(this.currentExpenditure.cost) * Number(this.currentExpenditure.quantity);
  }

  ngOnInit(): void {
  }

  abortAdd() {
    this.dialogRef.close();
  }

  addRecord() {
    if (this.outgoingsForm.valid) {
      const amountPaid = Number(this.outgoingsForm.controls.amountPaid.value);
      if (amountPaid === (Number(this.currentExpenditure.cost) * Number(this.currentExpenditure.quantity))) {
        this.currentExpenditure.paid = true;
      }
      this.currentExpenditure.amountSpent = amountPaid;
      this.currentExpenditure.isDirty = true;
      let exps = this.dataService.cache.get('expenditure');
      exps.splice(exps.indexOf(exps.filter(itm => itm._id === this.currentExpenditure._id)[0]), 1);
      exps.push(this.currentExpenditure);
      this.dataService.updater.emit({name: 'cacheUpdated', type: 'expenditure'});
      this.dialogRef.close();
    } else {
      this.dialogService.showDialog(new DialogModel('Error', 'You must enter a value before paying off.'), ['Ok']);
    }
  }
}
