import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {IDataTransferObject} from '../../classes/dto/interfaces/data-transfer-object.interface';
import {FormBuilder, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogService} from '../../services/dialog.service';
import {DropdownService} from '../../dropdown.service';
import {Outgoing} from '../../classes/dto/outgoing';
import {DialogModel} from '../../dialog/dialog/dialog-model';
import {Exception} from '../../classes/dto/exception';

@Component({
  selector: 'app-add-exception-dialog',
  templateUrl: './add-exception-dialog.component.html',
  styleUrls: ['./add-exception-dialog.component.scss']
})
export class AddExceptionDialogComponent implements OnInit {
  @Output() public static addRecord: EventEmitter<IDataTransferObject> = new EventEmitter<IDataTransferObject>();

  public exceptionForm = this.fb.group({
    outgoingId: ['', Validators.required],
    costModifier: ['', Validators.required],
    costAmount: ['', Validators.required],
    reason: ['', Validators.required],
    exceptionStarts: ['', Validators.required],
    exceptionExpire: [''],
    exceptionEnds: ['']
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddExceptionDialogComponent>,
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
    if (this.exceptionForm.valid) {
      const exception = new Exception();
      const form = this.exceptionForm.controls;
      exception.outgoingId = form.outgoingId.value;
      exception.costModifier = form.costModifier.value;
      exception.costAmount = form.costAmount.value;
      exception.reason = form.reason.value;
      exception.startFrom = form.exceptionStarts.value;
      if (form.exceptionExpire.value) {
        exception.expiryDate = form.exceptionEnds.value;
      }
      AddExceptionDialogComponent.addRecord.emit(exception);
      this.dialogRef.close();
    } else {
      this.dialogService.showDialog(new DialogModel('Error', 'Term Form must be valid before submitting'), ['Ok']);
    }
  }

  public getDropDownOptions(backingField) {
    return this.dropDownService.getDropDownOptions(backingField);
  }
}
