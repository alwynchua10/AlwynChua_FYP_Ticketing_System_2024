import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { UserTableComponent } from './components/user-table/user-table.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxSmartModalModule } from 'ngx-smart-modal';

@NgModule({
  declarations: [UserManagementComponent, UserTableComponent],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    SharedModule,
    MatIconModule,
    MatPaginatorModule,
    NgxSmartModalModule.forChild(),
  ],
})
export class UserManagementModule {}
