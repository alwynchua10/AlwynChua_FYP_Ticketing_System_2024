import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PriorityService {
  private apiUrl = 'https://localhost:7179/api/Priorities';

  constructor(private http: HttpClient) {}

  // Get all priorities
  getPriorities(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Get a priority by ID
  getPriorityById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Create a new priority
  createPriority(priorityData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, priorityData);
  }

  // Update a priority by ID
  updatePriority(priorityId: number, priorityData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${priorityId}`, priorityData);
  }

  // Delete a priority by ID
  deletePriority(priorityId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${priorityId}`);
  }
}
