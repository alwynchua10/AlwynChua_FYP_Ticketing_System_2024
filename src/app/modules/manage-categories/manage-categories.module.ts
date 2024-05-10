import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageCategoriesComponent } from './pages/manage-categories/manage-categories.component';
import { CoreModule } from 'src/app/core/core.module';
import { CategoryTableComponent } from './components/category-table/category-table.component';
import { FormsModule } from '@angular/forms';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ManageCategoriesComponent, CategoryTableComponent],
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
export class ManageCategoriesModule {}
