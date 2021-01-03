import { NgModule } from '@angular/core';
import {CommonModule, Location} from '@angular/common';
import { TransactionsComponent } from './transactions/transactions.component';
import {AuthenticationManagerModule} from '../authentication-manager/authentication-manager.module';
import {ProtectedDirective} from '../authentication-manager/protected.directive';
import {MatTableModule} from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import { AddPeriodComponent } from './add-period/add-period.component';
import { AddExpenditureComponent } from './add-expenditure/add-expenditure.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { PayOutgoingComponent } from './pay-outgoing/pay-outgoing.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {SpinnerModule} from '../spinner/spinner.module';



@NgModule({
  declarations: [TransactionsComponent, AddPeriodComponent, AddExpenditureComponent, PayOutgoingComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatTableModule,
    MatSelectModule,
    MatPaginatorModule,
    MatChipsModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    AuthenticationManagerModule,
    SpinnerModule
  ],
  bootstrap: [Location, ProtectedDirective]
})
export class TransactionsModule { }
