import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogService} from '../../services/dialog.service';
import {DropdownService} from '../../dropdown.service';
import {FormBuilder, Validators} from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import {MatDatepicker} from '@angular/material/datepicker';
import {MatDrawer} from '@angular/material/sidenav';

import * as moment from 'moment';
import {Moment} from 'moment';
import {DataTransferService} from '../../services/data-transfer.service';
import {Term} from '../../classes/dto/term';
import {Expenditure} from '../../classes/dto/expenditure';
import {DialogModel} from '../../dialog/dialog/dialog-model';
import {Period} from '../../classes/dto/period';
import {IDataTransferObject} from '../../classes/dto/interfaces/data-transfer-object.interface';


export const MONTH_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-add-period',
  templateUrl: './add-period.component.html',
  styleUrls: ['./add-period.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MONTH_FORMATS},
  ],
})
export class AddPeriodComponent implements OnInit {
  @Output() public static addRecord: EventEmitter<IDataTransferObject> = new EventEmitter<IDataTransferObject>();
  @ViewChild('dp') public datePicker: MatDatepicker<Moment>;

  public periodForm = this.fb.group({
    name: ['', Validators.required],
    termId: ['', Validators.required],
    startsFrom: ['', Validators.required],
    endsOn: ['', Validators.required],
    income: ['', Validators.required],
    discrepancyReason: ['', Validators.required]
  });
  private term: Term = null;

  constructor(public fb: FormBuilder,
              public dialogRef: MatDialogRef<AddPeriodComponent>,
              private dialogService: DialogService,
              private dropDownService: DropdownService,
              private dataService: DataTransferService) {
  }

  ngOnInit(): void {
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.periodForm.controls.startsFrom.value;
    ctrlValue.year(normalizedYear.year());
    this.periodForm.controls.startsFrom.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment) {
    const ctrlValue = this.periodForm.controls.startsFrom.value;
    ctrlValue.month(normalizedMonth.month());
    this.periodForm.controls.startsFrom.setValue(ctrlValue);
    let startDate = ctrlValue.format('MMMM DD YYYY');
    const endDate = ctrlValue.add('month', 1).set('date', this.term.endDay);
    this.periodForm.controls.endsOn.setValue(endDate);
    this.periodForm.controls.name.setValue(`${startDate} - ${endDate.format('MMMM DD YYYY')}`);
    this.datePicker.close();
  }

  public getDropDownOptions(backingField) {
    return this.dropDownService.getDropDownOptions(backingField);
  }

  termSelected(value: any) {
    const items: Term[] = this.dataService.cache.get('term') || [];
    const filter = items.filter(itm => itm._id === value);
    if (filter) {
      if (filter.length) {
        if (filter.length > 0) {
          this.term = filter[0];
          const startDate = moment().set('date', this.term.startDay);
          this.periodForm.controls.startsFrom.setValue(startDate);
          this.periodForm.controls.income.setValue(this.term.baseIncome);
          const endDate = moment().add('month', 1).set('date', this.term.endDay);
          this.periodForm.controls.endsOn.setValue(endDate);
          this.periodForm.controls.name.setValue(`${startDate.format('MMMM DD YYYY')} - ${endDate.format('MMMM DD YYYY')}`);
        }
      }
    }
  }
  abortAdd() {
    this.dialogRef.close();
  }
  addRecord() {
    if (this.periodForm.valid) {
      const period = new Period();
      const form = this.periodForm.controls;
      period.name = form.name.value;
      period.income = form.income.value;
      period.discrepancyReason = form.discrepancyReason.value;
      period.startsFrom = form.startsFrom.value.toDate();
      period.endsOn = form.endsOn.value.toDate();
      AddPeriodComponent.addRecord.emit(period);
      this.dialogRef.close();
    } else {
      this.dialogService.showDialog(new DialogModel('Error', 'Period Form must be valid before submitting'), ['Ok']);
    }
  }
}
