import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ToastsContainerComponent } from './components/toast/toasts-container/toasts-container.component';
import {
  NgbPaginationModule,
  NgbToastModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from './components/toast/toast.service';

@NgModule({
  declarations: [ToastsContainerComponent],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    NgxSmartModalModule.forChild(),
    MatIconModule,
    MatButtonModule,
    NgbToastModule,
    NgbPaginationModule,
  ],
  providers: [ToastService],
  exports: [ToastsContainerComponent],
})
export class SharedModule {}
