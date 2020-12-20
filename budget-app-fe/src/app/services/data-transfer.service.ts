import {EventEmitter, Injectable} from '@angular/core';
import {QueryGroup} from '../classes/dto/filtering/query-group';
import {IDataTransferObject} from '../classes/dto/interfaces/data-transfer-object.interface';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LoginService} from './login.service';
import {DtoHelper} from '../setup-budgets/setup-budgets/dto.helper';
import {Thread} from '../setup-budgets/setup-budgets/thread';
import {BehaviorSubject, Observable} from 'rxjs';
import {Query} from '../classes/dto/filtering/query';
import {FilterTypeEnum} from '../classes/dto/filtering/filter-type.enum';
import {take, takeUntil, tap} from 'rxjs/operators';
import {StateService} from '../state.service';
import {DropDownList} from './table';

@Injectable({
  providedIn: 'root'
})
export class DataTransferService {
  public dropDowns: DropDownList[] = [];
  public loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public js: EventEmitter<any> = new EventEmitter<any>();
  public updater: EventEmitter<any> = new EventEmitter<any>();
  public cache: Map<string, any[]> = new Map<string, any[]>();
  private caches: number;
  private cachesCompleted: number;

  constructor(private http: HttpClient, private loginService: LoginService, private periodService: StateService) {
    this.loginService.isAuthenticated.subscribe(async (value) => this.cacheBaseItems(value));
  }

  public async findItems<T extends IDataTransferObject>(typeName: string, queryGrouping: QueryGroup = null): Promise<string> {
    if (this.loginService.authenticated) {
      return await this.performFetch(typeName, queryGrouping);
    } else {
      return new Promise(resolve => {
        this.loginService.isAuthenticated.pipe(take(1)).subscribe(async (next: boolean) => {
          if (next) {
            resolve(await this.performFetch(typeName, queryGrouping));
          }
        });
      });
    }
  }

  private async performFetch(typeName: string, queryGrouping: QueryGroup) {
    let items: any[] = [];

    const requestUrl = `${environment.backendHost}find/${typeName}`;
    const req = this.http.post(requestUrl, queryGrouping, {headers: this.commonHeaders()});
    await req.subscribe((value: any[]) => {
      items = value;
      console.log(`fetch: ${JSON.stringify(value)}`);
      this.js.emit({name: 'find', type: typeName, value: items});
    }, (err) => {
      console.error('couldn\'t fetch: ');
      console.error(JSON.stringify(err));
    }, () => {
      console.log('fetch complete');
    });
    return Promise.resolve('');
  }

  public async insertItem<T extends IDataTransferObject>(typeName, item: T): Promise<void> {
    console.log('callinsertitem');
    const requestUrl = `${environment.backendHost}insert/${typeName}`;

    const req = this.http.put(requestUrl, item);
    await req.subscribe((value) => {
      console.log(`insertItem: ${value.toString()}`);
      return Promise.resolve();
    }, (err) => {
      console.error('couldn\'t insertItem');
      console.error(JSON.stringify(err));
      return Promise.reject(err);
    });
  }

  public async insertManyItem(typeName, item: any[]): Promise<void> {
    console.log('callinsertManyitem');
    const requestUrl = `${environment.backendHost}insertMany/${typeName}`;

    const req = this.http.put(requestUrl, item);
    await req.subscribe((value) => {
      return Promise.resolve();
    }, (err) => {
      console.error('couldn\'t insertItem');
      console.error(JSON.stringify(err));
      return Promise.reject(err);
    });
  }

  public async updateItems<T extends IDataTransferObject>(typeName, items: T): Promise<void> {
    const requestUrl = `${environment.backendHost}update/${typeName}`;
    const req = this.http.post(requestUrl, items, {headers: this.commonHeaders()});
    await req.subscribe((value) => {
      console.log('updateItems');
      console.log(JSON.stringify(value));
      return Promise.resolve();
    }, (err: any) => {
      console.error('error updating Items');
      console.error(JSON.stringify(err));
    }, () => {
      console.log('updating items complete');
    });
    return Promise.resolve();
  }

  private commonHeaders() {
    const hdr = new HttpHeaders();
    hdr.append('Access-Control-Allow-Origin', environment.backendHost);
    hdr.append('Authorization', `Bearer ${this.loginService.authToken}`);
    return hdr;
  }

  public async deleteItems<T extends IDataTransferObject>(typeName, items: Array<T>): Promise<void> {
    const requestUrl = `${environment.backendHost}delete/${typeName}`;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item) {
        console.log(item);
        const a = item as IDataTransferObject;
        console.log(a);
        const req = this.http.delete(`${requestUrl}/${a._id.toString()}`);
        await req.subscribe((value) => {
          console.log('deleteItems');
          console.log(JSON.stringify(value));
        }, (err) => {
          console.error('error deleting items');
          console.error(JSON.stringify(err));
        }, () => {
          console.log('delete Items completed');
        });
      }
    }
    return Promise.resolve();
  }

  public async cacheBaseItems(authenticated: boolean) {
    this.cachesCompleted = 0;
    this.caches = 0;
    if (authenticated) {
      this.loading.next(true);
      this.dropDowns = [];
      Promise.all([
        await this.createCacheFor('period', null),
        await this.cacheExpenditureItems(),
        await this.createCacheFor('exception', null),
        await this.createCacheFor('outgoing', null),
        await this.createCacheFor('term', null),
        await this.createCacheFor('category', null)
      ])
        .then(() => {
          console.log('complete all');
        });
      // await this.createCacheFor('threshold').then(() =>{});
      // await this.createCacheFor('expenditures').then(()=>{});
    } else {
      this.cache = new Map<string, any>();
    }
  }

  public async createCacheFor(dto: string, queryGroup: QueryGroup) {
    if (this.caches === 0) {
      this.loading.next(true);
    }
    this.caches++;
    this.js.subscribe(subscription => {
      const tmp = [];
      if (subscription.name === 'find' && subscription.type === dto) {
        for (let i = 0; i < subscription.value.length; i++) {
          tmp.push(subscription.value[i]);
        }
        this.cache.set(dto, tmp);
        this.cachesCompleted++;
        if (this.caches === this.cachesCompleted) {
          this.loading.next(false);
        }
      }
      console.log(tmp);
      console.log(this.cache);
      this.updater.emit({name: 'cacheUpdated', type: dto});
      return Promise.resolve();
    });
    await this.findItems(dto, queryGroup);
  }

  public async onSave(types: string[]) {
    for (let i = 0; i < types.length; i++) {
      const type = types[i];
      const items = this.cache.get(type);
      const itemsHavingIdentifier = items.filter(itm => DtoHelper.hasIdentifier(itm));
      const itemsWithoutIdentifier = items.filter(itm => !DtoHelper.hasIdentifier(itm));

      const promises = [];
      for (let x = 0; x < itemsHavingIdentifier.length; x++) {
        console.log(`onsave-${x}`);
        const item = items[x] as IDataTransferObject;
        if (item.isDeleted && DtoHelper.hasIdentifier(item)) {
          console.log(`onsave-del`);
          promises.push(await this.deleteItems(type, [item]).then(() => {
          }));
        } else if (item.isDirty && DtoHelper.hasIdentifier(item)) {
          console.log(`onsave-mod`);
          promises.push(await this.updateItems(type, item).then(() => {
          }));
        }
      }
      promises.push(await this.insertManyItem(type, itemsWithoutIdentifier));
      Promise.all(promises).then(async () => {
        return await Thread.sleep(1000).then(async () => {
          return await this.cacheBaseItems(true).then(() => {
          });
        });
      });
    }
  }

  async cacheExpenditureItems() {
    this.caches = 0;
    this.cachesCompleted = 0;
    if (this.periodService.selectedPeriod.value) {
      const qg = new QueryGroup();
      const q = new Query();
      q.fieldName = 'periodId';
      q.comparisonType = FilterTypeEnum.equals;
      q.fieldValue = this.periodService.selectedPeriod.value;
      qg.queries.push(q);
      return await this.createCacheFor('expenditure', qg);
    }
  }
}
