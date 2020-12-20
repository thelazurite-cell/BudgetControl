import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectorRef,
  DoCheck,
  EventEmitter,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {ComponentType} from '@angular/cdk/portal';
import {MatDialog} from '@angular/material/dialog';
import {DataTransferService} from '../services/data-transfer.service';
import {BaseTableService} from '../services/base-table.service';
import {BehaviorSubject} from 'rxjs';
import {Table} from '../services/table';
import {AddEmitter} from '../services/add.emitter';
import {AddTermDialogComponent} from '../setup-budgets/add-term-dialog/add-term-dialog.component';
import {Term} from '../classes/dto/term';
import {GenerationOptions} from '../services/generation.options';
import {IDataTransferObject} from '../classes/dto/interfaces/data-transfer-object.interface';

export abstract class BaseTableComponent implements OnInit, AfterViewInit, DoCheck, AfterContentChecked {
  public abstract get isAddRecordSubscribed(): boolean;
  public abstract set isAddRecordSubscribed(value: boolean);

  public get items() {
    return this.itemsSubscription.getValue();
  }

  public set items(value: any) {
    this.itemsSubscription.next(value);
    if (this.isInit) {
      this.createTermTable();
    }
  }

  constructor(
    public type: string,
    public componentType: ComponentType<any>,
    public dialog: MatDialog,
    public dataService: DataTransferService,
    public tableService: BaseTableService,
    public cdref: ChangeDetectorRef,
    public generationOptions: GenerationOptions = new GenerationOptions(),
  ) {

  }

  @ViewChild(`Table`, {read: ViewContainerRef})
  protected termTableHolder: ViewContainerRef;

  public itemsSubscription: BehaviorSubject<any[]> = new BehaviorSubject(this.dataService.cache.get(this.type));
  public termTable: Table;
  private isInit: boolean = false;

  ngOnInit(): void {
    this.items = this.dataService.cache.get(this.type) || [];
    this.dataService.updater.subscribe((val) => {
      if (val.name === 'cacheUpdated') {
        if (val.type === this.type) {
          this.items = this.dataService.cache.get(this.type) || [];
        }
      }
    });
  }

  async ngAfterViewInit() {
    this.initializeTable().then(() => {
      this.isInit = true;
    });
  }

  private async initializeTable() {
    this.createTermTable();
    if (this.isAddRecordSubscribed === false) {
      this.isAddRecordSubscribed = true;
      this.tableService.add.subscribe(async (addEmitter: AddEmitter) => {
        if (addEmitter.type === this.type) {
          await this.extracted().then(() => {
          });
        }
      });
      const ct: any = (this.componentType as any);
      ct.addRecord = new EventEmitter<IDataTransferObject>();

      Promise.resolve(() => ct.addRecord.unsubscribe()).then(() => ct.addRecord.subscribe(async (item: Term) => {
        this.dataService.cache.get(this.type).push(item);
        this.dataService.updater.emit({name: 'cacheUpdated', type: this.type});

        // await this.dataService.insertItem(this.type, item).then(async () => {
        // });
      }));
    }

  }

  private async extracted() {
    this.dialog.open(this.componentType, {width: '500vw'});
  }

  private createTermTable() {

    this.termTable = this.tableService.createTable(this.items, this.type, this.termTableHolder, this.generationOptions);
  }

  public async onSave(types: string[]) {
    await this.dataService.onSave(types).then(() => {
    });
  }

  async ngDoCheck() {
  }

  ngAfterContentChecked(): void {
    this.cdref.detectChanges();
  }
}
