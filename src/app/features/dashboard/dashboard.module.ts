import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard.component';
import { NgChartsModule } from 'ng2-charts';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgChartsModule,
    ButtonModule,
    CalendarModule,
  ],
  exports: [DashboardComponent],
  providers: [DatePipe],
})
export class DashboardModule {}
