import { Component } from '@angular/core';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/core/APIservices/login.service';

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

  constructor(private router: Router, private loginService: LoginService) {}

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  onSubmit(): void {
    this.loginService.login(this.email, this.password).subscribe({
      next: (response) => {
        // Handle successful login
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
