import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserDto, LoginDto } from '../models/user.dto';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://localhost:7179/api/Users';
  private token: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  getUserIdFromToken(): number | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken?.nameid || null; // Adjust 'nameid' based on your token structure
      } catch (error) {
        console.error('Error decoding token', error);
        return null;
      }
    }
    return null;
  }

  // Get all users
  getUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(this.apiUrl);
  }

  // Get a user by ID
  getUserById(id: number): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/${id}`);
  }

  // Register a new user
  register(userData: UserDto): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.apiUrl}/register`, {
      userName: userData.userName,
      userEmail: userData.userEmail,
      password: userData.passwordHash,
      roleID: userData.roleID,
    });
  }

  login(userEmail: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, { userEmail, password })
      .pipe(
        tap((response) => {
          if (response.token && response.userID && response.roleID) {
            localStorage.setItem('token', response.token); // Store the token
            localStorage.setItem('userID', response.userID); // Store the UserID
            localStorage.setItem('roleID', response.roleID); // Store the RoleID
          } else {
            console.error('No token, UserID, or RoleID found in response');
          }
        })
      );
  }

  logout() {
    // Remove the token and user ID from storage
    localStorage.removeItem('token');
    localStorage.removeItem('userID'); // Adjust if you're storing it differently
    localStorage.removeItem('roleID');
    // Redirect to login page
    this.router.navigate(['/login']);
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return !!this.token || !!localStorage.getItem('token');
  }

  getToken(): string | null {
    const tokenFromStorage = localStorage.getItem('token');
    console.log('Retrieved Token:', tokenFromStorage); // Log for debugging
    return this.token || tokenFromStorage; // Return token from memory or storage
  }

  // Update user details
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
