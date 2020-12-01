import { NgModule } from '@angular/core';
import {CommonModule, Location} from '@angular/common';
import {ProtectedDirective} from './protected.directive';



@NgModule({
  declarations: [ProtectedDirective],
  imports: [
    CommonModule
  ],
  exports: [
    ProtectedDirective
  ],
  bootstrap: [Location]
})
export class AuthenticationManagerModule { }
