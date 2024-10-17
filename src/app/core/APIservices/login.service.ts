import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private baseUrl = 'https://localhost:7179/api/Users'; // Adjust as needed

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const payload = { UserEmail: email, Password: password }; // Update keys to match API requirements

    return this.http.post(`${this.baseUrl}/login`, payload).pipe(
      map((response: any) => {
        // Assuming JWT token is in the response, store it in local storage
        if (response && response.token) {
          localStorage.setItem('authToken', response.token);
        }
        return response;
      })
    );
  }

  // Optionally, you can add a method to check if the user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken'); // Returns true if token exists
  }
}
