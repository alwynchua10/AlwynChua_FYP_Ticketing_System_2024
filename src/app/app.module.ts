import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DashboardModule } from './modules/home/dashboard.module';
import { CreateReportModule } from './modules/create-report/create-report.module';
import { ReportStatisticsModule } from './modules/report-statistics/report-statistics.module';
import { UserManagementModule } from './modules/user-management/user-management.module';
import { ManageCategoriesModule } from './modules/manage-categories/manage-categories.module';
import { CoreModule } from './core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RegisterModule } from './modules/register/register.module';
import { LoginModule } from './modules/login/login.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EditTicketModule } from './modules/edit-ticket/edit-ticket.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    CoreModule,
    DashboardModule,
    CreateReportModule,
    EditTicketModule,
    ReportStatisticsModule,
    UserManagementModule,
    ManageCategoriesModule,
    RegisterModule,
    LoginModule,
    BrowserAnimationsModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
