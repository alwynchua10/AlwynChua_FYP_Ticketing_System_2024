import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserDto, LoginDto } from '../models/user.dto';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://localhost:7179/api/Users';
  private token: string | null = null;

  constructor(private http: HttpClient) {}

  getUserIdFromToken(): number | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken?.UserID || null; // Adjust 'UserID' based on your token structure
      } catch (error) {
        console.error('Error decoding token', error);
        return null;
      }
    }
    return null;
  }

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
    return this.http.post<any>(`${this.apiUrl}/login`, loginData).pipe(
      tap((response) => {
        this.token = response.token; // Save token
        localStorage.setItem('token', this.token || '');
      })
    );
  }

  // Log out user
  logout(): void {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return !!this.token || !!localStorage.getItem('token');
  }

  // Method to retrieve the token
  getToken(): string | null {
    return this.token || localStorage.getItem('token');
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
