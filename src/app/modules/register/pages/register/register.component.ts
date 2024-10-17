import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/core/APIservices/user.service';
import { Router } from '@angular/router';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { UserDto } from 'src/app/core/models/user.dto';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = ''; // Declare errorMessage here
  defaultRoleId: number = 1; // Set your default role ID here

  faCircleInfo = faCircleInfo;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
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
      const userData: UserDto = {
        userName: this.registerForm.value.userName,
        userEmail: this.registerForm.value.userEmail,
        passwordHash: this.registerForm.value.password, // Send raw password
        roleID: this.defaultRoleId, // Optional if applicable
      };

      this.userService.register(userData).subscribe({
        next: (response) => {
          this.goToLogin();
        },
        error: (error) => {
          if (error.status === 409) {
            this.errorMessage = 'User already exists.';
          } else {
            this.errorMessage = 'Registration failed. Please try again.';
          }
        },
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
