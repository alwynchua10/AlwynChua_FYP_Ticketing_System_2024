import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportStatisticsComponent } from './pages/report-statistics/report-statistics.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { TicketChartComponent } from './components/ticket-chart/ticket-chart.component';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  declarations: [ReportStatisticsComponent, TicketChartComponent],
  imports: [CommonModule, CoreModule, NgApexchartsModule],
})
export class ReportStatisticsModule {}
