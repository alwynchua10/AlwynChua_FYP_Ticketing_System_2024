import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './modules/home/pages/dashboard/dashboard.component';
import { LoginComponent } from './modules/login/pages/login/login.component';
import { CreateReportComponent } from './modules/create-report/pages/create-report/create-report.component';
import { EditReportComponent } from './modules/edit-report/pages/edit-report/edit-report.component';
import { UserManagementComponent } from './modules/user-management/pages/user-management/user-management.component';
import { ManageCategoriesComponent } from './modules/manage-categories/pages/manage-categories/manage-categories.component';
import { ReportStatisticsComponent } from './modules/report-statistics/pages/report-statistics/report-statistics.component';
import { RegisterComponent } from './modules/register/pages/register/register.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'create-report',
    component: CreateReportComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-report/:reportID',
    component: EditReportComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user-management',
    component: UserManagementComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'manage-categories',
    component: ManageCategoriesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'report-statistics',
    component: ReportStatisticsComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
