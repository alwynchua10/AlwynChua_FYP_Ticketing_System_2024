import { Component } from '@angular/core';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/core/APIservices/login.service';
import { DashboardTableService } from 'src/app/modules/home/components/dashboard-table/dashboard-table.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  faCircleInfo = faCircleInfo;

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private router: Router,
    private loginService: LoginService,
    private dashboardTableService: DashboardTableService // Inject DashboardTableService
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

        if (userId && roleId) {
          this.dashboardTableService.setUserAndRole(+userId, +roleId); // Set user ID and role ID in DashboardTableService
        }

        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        // Handle error
        this.errorMessage =
          err.error.title || 'Login failed. Please try again.';
      },
    });
  }
}
