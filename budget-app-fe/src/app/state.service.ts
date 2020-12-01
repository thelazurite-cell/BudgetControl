import {Injectable} from '@angular/core';
import {DataTransferService} from './services/data-transfer.service';
import {BehaviorSubject} from 'rxjs';
import {DropdownService} from './dropdown.service';
import {Expenditure} from './classes/dto/expenditure';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  public selectedPeriod: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public currentExpenditure: Expenditure = null;

  public async setSelectedPeriod(value: string){
    this.selectedPeriod.next(value);
  }

  constructor() {
  }
}
