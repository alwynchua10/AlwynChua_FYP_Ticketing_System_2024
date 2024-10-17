import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDto, LoginDto } from '../models/user.dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://localhost:7179/api/Users';

  constructor(private http: HttpClient) {}

  // Get all users (Updated to use UserDto[])
  getUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(this.apiUrl);
  }

  // Get a user by ID
  getUserById(id: number): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/${id}`);
  }

  // Register a new user (Adjusted to match the component's data format)
  register(userData: UserDto): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.apiUrl}/register`, {
      userName: userData.userName,
      userEmail: userData.userEmail,
      password: userData.passwordHash,
      roleID: userData.roleID,
    });
  }

  // Log in a user (returns a token or user info depending on your setup)
  login(loginData: LoginDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, loginData);
  }

  // Update user details (Adjusted to ensure correct property casing)
  updateUser(id: number, userData: UserDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, {
      userName: userData.userName,
      userEmail: userData.userEmail,
      roleID: userData.roleID,
    });
  }

  // Delete a user by ID
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
