import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';



@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    RouterModule.forChild([{ path: '', component: HomeComponent }]),
    NgChartsModule
  ],
})
export class HomeModule {}
