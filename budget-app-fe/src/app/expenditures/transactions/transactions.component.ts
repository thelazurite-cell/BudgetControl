import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {DataTransferService} from '../../services/data-transfer.service';
import {BaseTableService} from '../../services/base-table.service';
import {AddOutgoingDialogComponent} from '../../setup-budgets/add-outgoing-dialog/add-outgoing-dialog.component';
import {GenerationOptions} from '../../services/generation.options';
import {CustomActionBuilder} from '../../services/table';
import {BaseTableComponent} from '../../table/base-table.component';
import {AddPeriodComponent} from '../add-period/add-period.component';
import {AddExpenditureComponent} from '../add-expenditure/add-expenditure.component';
import {DropdownService} from '../../dropdown.service';
import {StateService} from '../../state.service';
import {AddEmitter} from '../../services/add.emitter';
import {IDataTransferObject} from '../../classes/dto/interfaces/data-transfer-object.interface';
import {Term} from '../../classes/dto/term';
import {Period} from '../../classes/dto/period';
import {Outgoing} from '../../classes/dto/outgoing';
import {Exception} from '../../classes/dto/exception';
import {Expenditure} from '../../classes/dto/expenditure';
import * as moment from 'moment';
import {PayOutgoingComponent} from '../pay-outgoing/pay-outgoing.component';
import {DialogService} from '../../services/dialog.service';


@Component({
  selector: 'app-expenditures',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent extends BaseTableComponent implements AfterViewInit {

  public get expectedTotal(): number{
    const itms = this.items;
    let tmpTotal = 0;
    for (let i = 0; i < itms.length; i++){
      const itm = itms[i] as Expenditure;
      tmpTotal += itm.quantity * itm.cost;
    }
    return tmpTotal;
  }

  public get isAddPeriodSubscribed(): boolean {
    return this.addPeriodSubscribed;
  }

  public set isAddPeriodSubscribed(value: boolean) {
    this.addPeriodSubscribed = value;
  }

  constructor(
    public dialog: MatDialog,
    public dataService: DataTransferService,
    public tableService: BaseTableService,
    public dropDownService: DropdownService,
    public stateService: StateService,
    public cdref: ChangeDetectorRef,
    private dialogService: DialogService
  ) {
    super(
      'expenditure',
      AddExpenditureComponent,
      dialog,
      dataService,
      tableService,
      cdref,
      new GenerationOptions(
        ['cost', 'quantity', 'amountSpent'],
        [
          CustomActionBuilder
            .createAction()
            .withALabelOf('Pay Off')
            .withDisableCheck((itm: any) => {
              const exp = itm.source as Expenditure;
              console.log(itm);
              return exp.outgoingId === '' || exp.paid;
            }).withColor('#78d08b').and.withIcon('done')
            .withCustomAction((event, item) => {
              this.stateService.currentExpenditure = item.source;
              this.dialog.open(PayOutgoingComponent, {width: '500vw'});
            }).build()
        ], ['outgoingId', 'periodId', 'paid']
      ));
    if (TransactionsComponent.isSubscribed == null) {
      TransactionsComponent.isSubscribed = false;
    }
    this.stateService.selectedPeriod.subscribe((value) => {
      this.selectedPeriod = value;
    });
  }

  get isAddRecordSubscribed(): boolean {
    return TransactionsComponent.isSubscribed;
  }

  set isAddRecordSubscribed(value: boolean) {
    TransactionsComponent.isSubscribed = true;
  }

  public get isLoading(): boolean {
    return this.dataService.loading.getValue();
  }

  private static isSubscribed = null;
  private isInsertingPeriod: boolean = false;
  private isJsSubscribed: boolean = false;
  private addPeriodSubscribed = false;

  public selectedPeriod: string = null;

  async ngAfterViewInit() {
    await BaseTableComponent.prototype.ngAfterViewInit.call(this);
    if (this.isAddPeriodSubscribed === false) {
      this.isAddPeriodSubscribed = true;

      AddPeriodComponent.addRecord = new EventEmitter<IDataTransferObject>();

      Promise.resolve(() => AddPeriodComponent.addRecord.unsubscribe()).then(() => AddPeriodComponent.addRecord
        .subscribe(async (item: Period) => {
          await this.dataService.insertItem('period', item)
            .then(async () => {
              await this.dataService.createCacheFor('period', null).then(async value => {
                await this.afterPeriodInserted(item);
              });
            });
        }));
    }
  }

  private async afterPeriodInserted(item: Period) {
    this.isInsertingPeriod = true;
    if (!this.isJsSubscribed) {
      this.isJsSubscribed = true;
      this.dataService.js.subscribe(async (value: any) => {
        if (!this.isInsertingPeriod) {
          return;
        }
        this.isInsertingPeriod = false;
        this.dataService.loading.next(true);
        await this.identifyAndCreate(value, item);
      });
    }
    await this.dataService.createCacheFor('period', null);
  }

  private async identifyAndCreate(value: any, item: Period) {
    if (value.name === 'find' && value.type === 'period') {
      const result = value.value;
      const filter = result.filter(itm => {
        const cast = itm as Period;
        return cast.name === item.name;
      });
      await this.createDataForPeriod(filter, item);
    }
  }

  private async createDataForPeriod(filter, item: Period) {
    if (filter) {
      if (filter.length) {
        if (filter.length > 0) {
          const thisPeriod = filter[0];

          const pushUp: Expenditure[] = [];
          this.generateExpenditures(item, thisPeriod, pushUp).then(async (res) => {
            await this.dataService.insertManyItem('expenditure', res).then(async (val) => {
              this.stateService.selectedPeriod.next(thisPeriod._id);
              this.dialogService.showAutoCloseSnackbar('Financial Period Created');
              return await this.dataService.cacheBaseItems(true)
                .then(() => this.dataService.loading.next(false));
            });
          });
        }
      }
    }
  }

  private async generateExpenditures(item: Period, thisPeriod, pushUp: Expenditure[]): Promise<any[]> {
    return new Promise(async resolve => {
      let exceptions = this.dataService.cache.get('exception');
      let outgoings = this.dataService.cache.get('outgoing');

      if (!(outgoings && outgoings.length > 0)) {
        outgoings = await this.dataService.findItems('outgoing');
      }

      if (!(exceptions && exceptions.length > 0)) {
        exceptions = await this.dataService.findItems('exception');
      }

      for (let i = 0; i < outgoings.length; i++) {
        const outgoing = outgoings[i] as Outgoing;
        const tmp = new Expenditure();
        const val = this.getExceptionsValue(exceptions, outgoing, item);
        tmp.paid = false;
        tmp.categoryId = outgoing.categoryId;
        tmp.quantity = outgoing.quantity;
        tmp.name = outgoing.name;
        tmp.cost = Number(outgoing.cost) + val;
        tmp.periodId = thisPeriod._id;
        tmp.outgoingId = outgoing._id;
        const startDate = moment(item.startsFrom.toString());
        tmp.dueDate = outgoing.payOnDay >= startDate.date()
          ? startDate.set('date', outgoing.payOnDay).toDate()
          : startDate.add('month', 1).set('date', outgoing.payOnDay).toDate();
        pushUp.push(JSON.parse(JSON.stringify(tmp)));
      }
      resolve(pushUp);
    });
  }

  private getExceptionsValue(exceptions, outgoing, item: Period) {
    const exceptionsFilter = exceptions.filter(itm => {
      const cast = itm as Exception;
      return cast.outgoingId === outgoing._id;
    });
    let val = 0;

    if (exceptionsFilter) {
      if (exceptionsFilter.length) {
        if (exceptionsFilter.length > 0) {
          for (let x = 0; x < exceptionsFilter.length; x++) {
            const exception = exceptionsFilter[x] as Exception;
            if (item.startsFrom >= exception.startFrom) {
              if (exception.expiryDate) {
                if (exception.expiryDate.toString().trim() !== '') {
                  if (exception.expiryDate < item.startsFrom) {
                    continue;
                  }
                }
              }
              if (exception.costModifier) {
                val += exception.costAmount * -1;
              } else {
                val += exception.costAmount;
              }
            }
          }
        }
      }
    }
    return val;
  }

  createPeriod() {
    this.dialog.open(AddPeriodComponent, {width: '500vw'});
  }

  public getDropDownOptions(backingField) {
    return this.dropDownService.getDropDownOptions(backingField);
  }

  async onPeriodSelected(value: any) {
    await this.stateService.setSelectedPeriod(value);
    await this.dataService.cacheExpenditureItems();
  }
}
