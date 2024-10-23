import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserService } from './user.service'; // Import UserService
import { LoginDto } from '../models/user.dto';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private userService: UserService) {} // Inject UserService

  login(userEmail: string, password: string): Observable<any> {
    return this.userService.login(userEmail, password); // Delegate to UserService
  }

  isAuthenticated(): boolean {
    const token = this.userService.getToken(); // Use the method from UserService
    return !!token; // Returns true if the token exists, false otherwise
  }
}
