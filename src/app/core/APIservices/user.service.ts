import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDto, LoginDto } from '../models/user.dto'; // Create this model as needed

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://localhost:7179/api/Users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  register(userData: UserDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  login(loginData: LoginDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, loginData);
  }

  updateUser(id: number, userData: UserDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, userData);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
