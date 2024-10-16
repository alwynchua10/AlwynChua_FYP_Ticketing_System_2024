import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './pages/login/login.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; // Add this import for FontAwesome

@NgModule({
  declarations: [LoginComponent], // Declare LoginComponent
  imports: [
    CommonModule,
    FontAwesomeModule, // Include FontAwesomeModule
  ],
  exports: [LoginComponent], // Export if needed elsewhere
})
export class LoginModule {}
