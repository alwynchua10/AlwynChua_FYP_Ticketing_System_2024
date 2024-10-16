import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/core/APIservices/user.service'; // Ensure this path is correct
import { Router } from '@angular/router';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;

  faCircleInfo = faCircleInfo;

  constructor(
    private fb: FormBuilder,
    private userService: UserService, // Make sure this matches the service name
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      userName: ['', Validators.required],
      userEmail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.userService.register(this.registerForm.value).subscribe({
        next: (response) => {
          console.log('Registration Successful', response);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Registration Failed', error);
        },
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
