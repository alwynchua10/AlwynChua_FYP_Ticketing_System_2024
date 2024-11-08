import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'https://localhost:7179/api/Categories';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getCategoryById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createCategory(categoryData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, categoryData);
  }

  updateCategory(categoryId: number, categoryData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${categoryId}`, categoryData);
  }

  deleteCategory(categoryId: number): Observable<void> {
    const deleteUrl = `${this.apiUrl}/${categoryId}`;
    return this.http.delete<void>(deleteUrl);
  }
}
