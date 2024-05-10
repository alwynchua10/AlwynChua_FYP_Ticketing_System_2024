import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '../models/reportWithTasks';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private apiUrl = 'https://localhost:7179/api/Tasks';

  constructor(private http: HttpClient) {}

  createTask(taskData: Task): Observable<any> {
    return this.http.post<any>(this.apiUrl, taskData);
  }

  updateTask(taskId: number, taskData: Task): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${taskId}`, taskData);
  }

  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${taskId}`);
  }
}
