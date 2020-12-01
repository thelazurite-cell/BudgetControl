import {NgModule} from '@angular/core';
import {CommonModule, Location} from '@angular/common';
import {SetupBudgetsComponent} from './setup-budgets/setup-budgets.component';
import {AuthenticationManagerModule} from '../authentication-manager/authentication-manager.module';
import {ProtectedDirective} from '../authentication-manager/protected.directive';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ValidationModule} from '../validation/validation.module';
import {RegexDirective} from '../validation/regex.directive';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ColorPickerModule} from 'ngx-color-picker';
import {BaseTableService} from '../services/base-table.service';
import {AddTermDialogComponent} from './add-term-dialog/add-term-dialog.component';
import {DialogModule} from '../dialog/dialog.module';
import {CategoryEditComponent} from './category-edit/category-edit.component';
import {TermEditComponent} from './term-edit/term-edit.component';
import {OutgoingsEditComponent} from './outgoings-edit/outgoings-edit.component';
import {ExceptionEditComponent} from './exception-edit/exception-edit.component';
import {AddExceptionDialogComponent} from './add-exception-dialog/add-exception-dialog.component';
import {AddOutgoingDialogComponent} from './add-outgoing-dialog/add-outgoing-dialog.component';
import {MatSelectModule} from '@angular/material/select';
import {DropdownService} from '../dropdown.service';
import {SpinnerModule} from '../spinner/spinner.module';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';


@NgModule({
  declarations: [
    SetupBudgetsComponent,
    AddTermDialogComponent,
    CategoryEditComponent,
    TermEditComponent,
    OutgoingsEditComponent,
    ExceptionEditComponent,
    AddExceptionDialogComponent,
    AddOutgoingDialogComponent
  ],
  imports: [
    CommonModule,
    AuthenticationManagerModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSliderModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    FormsModule,
    ValidationModule,
    MatTooltipModule,
    MatSelectModule,
    ColorPickerModule,
    DialogModule,
    SpinnerModule
  ],
  bootstrap: [Location, ProtectedDirective, RegexDirective],
  providers: [
    BaseTableService,
    DropdownService
  ]
})
export class SetupBudgetsModule {
}
