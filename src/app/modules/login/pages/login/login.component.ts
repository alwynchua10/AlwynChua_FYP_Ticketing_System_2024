import { Component, TemplateRef, ViewChild } from '@angular/core';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/core/APIservices/login.service';
import { NgForm } from '@angular/forms';
import { DashboardTableService } from 'src/app/modules/home/components/dashboard-table/dashboard-table.service';
import { ToastService } from 'src/app/shared/components/toast/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  faCircleInfo = faCircleInfo;
  @ViewChild('myForm') form!: NgForm;
  @ViewChild('successTpl') successTpl!: TemplateRef<any>;
  @ViewChild('editTpl') editTpl!: TemplateRef<any>;
  @ViewChild('deleteTpl') deleteTpl!: TemplateRef<any>;
  @ViewChild('dangerTpl') dangerTpl!: TemplateRef<any>;

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private router: Router,
    private loginService: LoginService,
    private dashboardTableService: DashboardTableService, // Inject DashboardTableService
    private toastService: ToastService
  ) {}

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  onSubmit(): void {
    this.loginService.login(this.email, this.password).subscribe({
      next: (response) => {
        // Handle successful login
        const userId = localStorage.getItem('userID'); // Retrieve user ID from local storage
        const roleId = localStorage.getItem('roleID'); // Retrieve role ID from local storage
        this.triggerSuccessCreate();

        if (userId && roleId) {
          this.dashboardTableService.setUserAndRole(+userId, +roleId); // Set user ID and role ID in DashboardTableService
        }

        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        // Handle error
        this.errorMessage =
          err.error.title || 'Login failed. Please try again.';
        this.triggerEmptyToast();
      },
    });
  }

  triggerSuccessCreate() {
    this.toastService.showSuccess(this.successTpl);
  }

  triggerSuccessEdit() {
    this.toastService.showSuccess(this.editTpl);
  }

  triggerSuccessDelete() {
    this.toastService.showSuccess(this.deleteTpl);
  }

  triggerEmptyToast() {
    this.toastService.showDanger(this.dangerTpl);
  }
}
