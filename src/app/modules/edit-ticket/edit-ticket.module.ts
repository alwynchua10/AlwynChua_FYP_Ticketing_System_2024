import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditTicketComponent } from './pages/edit-report/edit-ticket.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { FormEditComponent } from './components/form-edit/form-edit.component';

@NgModule({
  declarations: [EditTicketComponent, FormEditComponent],
  imports: [CommonModule, CoreModule, SharedModule],
})
export class EditTicketModule {}
