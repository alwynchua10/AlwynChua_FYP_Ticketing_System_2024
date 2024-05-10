import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReportData } from '../models/reportWithTasks';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private baseUrl = 'https://localhost:7179/api/Reports';

  constructor(private http: HttpClient) {}

  submitReport(report: ReportData): Observable<any> {
    const url = `${this.baseUrl}/CreateReportWithTasks`;
    return this.http.post<any>(url, report);
  }

  updateReport(reportId: number, report: ReportData): Observable<any> {
    const url = `${this.baseUrl}/${reportId}`;
    return this.http.put<any>(url, report);
  }

  getReports(): Observable<ReportData[]> {
    const url = `${this.baseUrl}`;
    return this.http.get<ReportData[]>(url);
  }

  getReportById(reportID: number): Observable<ReportData> {
    const url = `${this.baseUrl}/${reportID}`;
    return this.http.get<ReportData>(url);
  }
}
