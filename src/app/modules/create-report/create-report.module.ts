import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateReportComponent } from './pages/create-report/create-report.component';
import { CoreModule } from 'src/app/core/core.module';
import { NgxSmartModalModule, NgxSmartModalService } from 'ngx-smart-modal';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [CreateReportComponent],
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    FormsModule,
    NgxSmartModalModule.forChild(),
    MatIconModule,
    MatButtonModule,
  ],
  providers: [NgxSmartModalService],
})
export class CreateReportModule {}
