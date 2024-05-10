import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditReportComponent } from './pages/edit-report/edit-report.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  declarations: [EditReportComponent],
  imports: [CommonModule, CoreModule, SharedModule],
})
export class EditReportModule {}
