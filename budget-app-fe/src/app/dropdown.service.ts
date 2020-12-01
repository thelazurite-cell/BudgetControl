import { Injectable } from '@angular/core';
import {KeyValuePair, DropDownList} from './services/table';
import {INamedDto} from './classes/dto/interfaces/expense-dto.interface';
import {DataTransferService} from './services/data-transfer.service';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  constructor(private dataService: DataTransferService) { }

  public getDropDownOptions(backingField) {
    const filter = this.dataService.dropDowns.filter((itm: DropDownList) => itm.backingField === backingField);
    if (filter) {
      if (filter.length > 0) {
        return filter[0].dropDownOptions;
      }
    }
    const key = backingField.toLowerCase().replace(/(id*)$/g, '');
    const dropDown = new DropDownList();
    dropDown.backingField = backingField;
    return this.getDropDown(key, dropDown);
  }

  private getDropDown(key, dropDown) {
    console.log(key);
    const cache = this.dataService.cache.get(key) as INamedDto[];
    if (cache) {
      const dd = [];
      for (let i = 0; i < cache.length; i++) {
        const item = cache[i];
        dd.push(new KeyValuePair(item._id, item));
      }
      dropDown.dropDownOptions = dd;
    }
    this.dataService.dropDowns.push(dropDown);

    return dropDown.dropDownOptions;
  }
}
