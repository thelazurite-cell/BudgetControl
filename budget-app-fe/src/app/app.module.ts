import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {Location} from '@angular/common';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoginModule} from './login/login.module';
import {MatButtonModule} from '@angular/material/button';
import {MatSliderModule} from '@angular/material/slider';
import {MatIconModule} from '@angular/material/icon';
import {LandingModule} from './landing/landing.module';
import {MatMenuModule} from '@angular/material/menu';
import {MatDividerModule} from '@angular/material/divider';
import {NavigationBarModule} from './navigation-bar/navigation-bar.module';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatOptionModule} from '@angular/material/core';
import {SidenavService} from './navigation-bar/sidenav.service';
import {TransactionsModule} from './expenditures/transactions.module';
import {SetupBudgetsModule} from './setup-budgets/setup-budgets.module';
import {ScenarioTesterModule} from './scenario-tester/scenario-tester.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {DataTransferService} from './services/data-transfer.service';
import {AuthInterceptor} from './services/auth-interceptor.service';
import {DialogService} from './services/dialog.service';
import {DialogModule} from './dialog/dialog.module';
import {TableModule} from './table/table.module';
import {BaseTableService} from './services/base-table.service';
import {DropdownService} from './dropdown.service';
import {TermEditComponent} from './setup-budgets/term-edit/term-edit.component';
import {Outgoing} from './classes/dto/outgoing';
import {OutgoingsEditComponent} from './setup-budgets/outgoings-edit/outgoings-edit.component';
import {StateService} from './state.service';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    DialogModule,
    BrowserModule,
    TableModule,
    HttpClientModule,
    BrowserAnimationsModule,
    LoginModule,
    LandingModule,
    NavigationBarModule,
    TransactionsModule,
    SetupBudgetsModule,
    ScenarioTesterModule,
    MatButtonModule,
    MatSliderModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatSidenavModule,
    MatOptionModule,
    MatSnackBarModule
  ],
  providers: [
    SidenavService,
    DataTransferService,
    DialogService,
    BaseTableService,
    DropdownService,
    StateService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent, Location],
  entryComponents: [TermEditComponent, OutgoingsEditComponent]
})
export class AppModule {
}
