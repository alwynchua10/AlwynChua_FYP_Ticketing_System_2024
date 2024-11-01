import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TicketDto } from '../models/ticket.dto';
import { Status } from '../models/status';
import { Priority } from '../models/priority';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private baseUrl = 'https://localhost:7179/api/Tickets';
  private prioUrl = 'https://localhost:7179/api/Priorities';
  private statUrl = 'https://localhost:7179/api/Statuses';
  private catUrl = 'https://localhost:7179/api/Categories';

  constructor(private http: HttpClient) {}

  createTicket(ticket: TicketDto): Observable<any> {
    return this.http.post(this.baseUrl, ticket);
  }

  getTickets(): Observable<TicketDto[]> {
    return this.http.get<TicketDto[]>(this.baseUrl);
  }

  getAllStatuses(): Observable<Status[]> {
    return this.http.get<Status[]>(this.statUrl);
  }

  getAllPriorities(): Observable<Priority[]> {
    return this.http.get<Priority[]>(this.prioUrl);
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.catUrl);
  }
}
