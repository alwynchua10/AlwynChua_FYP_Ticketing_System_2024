import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  private apiUrl = 'https://localhost:7179/api/Statuses';

  constructor(private http: HttpClient) {}

  // Get all statuses
  getStatuses(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Get a status by ID
  getStatusById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Create a new status
  createStatus(statusData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, statusData);
  }

  // Update a status by ID
  updateStatus(statusId: number, statusData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${statusId}`, statusData);
  }

  // Delete a status by ID
  deleteStatus(statusId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${statusId}`);
  }
}
