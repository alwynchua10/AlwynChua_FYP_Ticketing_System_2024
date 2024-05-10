import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportStatisticsComponent } from './pages/report-statistics/report-statistics.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';



@NgModule({
  declarations: [
    ReportStatisticsComponent
  ],
  imports: [
    CommonModule,
    CoreModule
  ]
})
export class ReportStatisticsModule { }
