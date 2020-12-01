import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RegexDirective} from './regex.directive';


@NgModule({
  declarations: [RegexDirective],
  imports: [
    CommonModule
  ],
  exports: [RegexDirective],
  providers: [RegexDirective]
})
export class ValidationModule {
}
