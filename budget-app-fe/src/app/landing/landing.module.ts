import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';
import { LandingContainerComponent } from './landing-container/landing-container.component';
import { Location} from '@angular/common';
import {ProtectedDirective} from '../authentication-manager/protected.directive';
import {AuthenticationManagerModule} from '../authentication-manager/authentication-manager.module';
import { ChartBuilderComponent } from './dash-bar-chart/chart-builder.component';
import {MatCardModule} from '@angular/material/card';
import { ChartjsModule } from '@ctrl/ngx-chartjs';
import {MatGridListModule} from '@angular/material/grid-list';

@NgModule({
  declarations: [LandingComponent, LandingContainerComponent, ChartBuilderComponent],
  imports: [
    CommonModule,
    AuthenticationManagerModule,
    MatCardModule,
    MatGridListModule,
    ChartjsModule
  ],
  bootstrap: [Location, ProtectedDirective]
})
export class LandingModule { }
