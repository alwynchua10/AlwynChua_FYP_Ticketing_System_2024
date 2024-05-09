import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, CoreModule],
})
export class DashboardModule {}
