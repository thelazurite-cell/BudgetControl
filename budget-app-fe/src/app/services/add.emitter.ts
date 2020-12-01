import {EventEmitter} from '@angular/core';

export class AddEmitter {
  public emitter: EventEmitter<any> = new EventEmitter<any>();
  public type: string = '';
}
