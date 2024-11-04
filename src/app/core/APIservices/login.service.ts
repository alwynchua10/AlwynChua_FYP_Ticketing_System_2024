import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private userService: UserService) {}

  login(userEmail: string, password: string): Observable<any> {
    return this.userService.login(userEmail, password);
  }

  isAuthenticated(): boolean {
    const token = this.userService.getToken();
    return !!token;
  }
}
