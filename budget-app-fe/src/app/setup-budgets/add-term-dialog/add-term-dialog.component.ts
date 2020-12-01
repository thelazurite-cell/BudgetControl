import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, Validators} from '@angular/forms';
import {regexValidator} from '../../validation/regexValidator';
import {Term} from '../../classes/dto/term';
import {DialogModel} from '../../dialog/dialog/dialog-model';
import {DialogService} from '../../services/dialog.service';
import {IDataTransferObject} from '../../classes/dto/interfaces/data-transfer-object.interface';

@Component({
  selector: 'app-add-term-dialog',
  templateUrl: './add-term-dialog.component.html',
  styleUrls: ['./add-term-dialog.component.scss']
})
export class AddTermDialogComponent implements OnInit {
  @Output() public static addRecord: EventEmitter<IDataTransferObject> = new EventEmitter<IDataTransferObject>();
  @ViewChild('endDay') public endDateField: ElementRef;

  public termForm = this.fb.group({
    termName: ['', Validators.required],
    termStart: ['', Validators.required, regexValidator('^([1-9]|1[0-9]|2[0-8])$')],
    termEnd: [''],
    termCommenceDate: ['', Validators.required],
    termExpire: [''],
    termExpiryDate: [''],
    termIncome: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<AddTermDialogComponent>, private dialogService: DialogService) {
  }

  ngOnInit(): void {
  }

  abortAdd() {
    this.dialogRef.close();
  }

  startDayChange($event) {
    if (this.termForm.controls.termStart.valid) {
      console.log(this.endDateField);
      const value = ($event.target.value.toString()) as number - 1;
      this.endDateField.nativeElement.value = value === 0 ? 28 : value;
      this.termForm.controls.termEnd.setValue(value);
    }
  }

  addRecord() {
    if (this.termForm.valid) {
      const term = new Term();
      const form = this.termForm.controls;
      term.name = form.termName.value;
      term.startFrom = form.termCommenceDate.value;
      term.baseIncome = form.termIncome.value;
      term.startDay = form.termStart.value;
      term.endDay = form.termEnd.value;
      if (form.termExpire.value) {
        term.expiryDate = form.termExpiryDate.value;
      }
      AddTermDialogComponent.addRecord.emit(term);
      this.dialogRef.close();
    } else {
      this.dialogService.showDialog(new DialogModel('Error', 'Term Form must be valid before submitting'), ['Ok']);
    }
  }
}
