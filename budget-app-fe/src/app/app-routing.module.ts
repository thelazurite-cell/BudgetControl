import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginModule} from './login/login.module';
import {LoginComponent} from './login/login/login.component';
import {LandingContainerComponent} from './landing/landing-container/landing-container.component';
import {Location} from '@angular/common';
import {ExpendituresComponent} from './expenditures/expenditures/expenditures.component';
import {SetupBudgetsComponent} from './setup-budgets/setup-budgets/setup-budgets.component';
import {ScenariosComponent} from './scenario-tester/scenarios/scenarios.component';

const routes: Routes = [
  {path: 'scenarios', component: ScenariosComponent},
  {path: 'setup', component: SetupBudgetsComponent},
  {path: 'expenditures', component: ExpendituresComponent},
  {path: 'login', component: LoginComponent},
  {path: '', component: LandingContainerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }), LoginModule],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
