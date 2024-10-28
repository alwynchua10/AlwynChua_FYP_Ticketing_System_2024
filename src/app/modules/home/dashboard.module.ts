import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CoreModule } from 'src/app/core/core.module';
import { DashboardTableComponent } from './components/dashboard-table/dashboard-table.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { NgbdSortableHeader } from './components/dashboard-table/sortable.directive';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TruncatePipe } from 'src/app/shared/components/truncate.pipe';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardTableComponent,
    DatePickerComponent,
    TruncatePipe,
  ],
  imports: [
    CommonModule,
    CoreModule,
    BrowserModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    NgbdSortableHeader,
    MatIconModule,
    MatButtonModule,
  ],
})
export class DashboardModule {}
