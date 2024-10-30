import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TicketDto } from '../models/ticket.dto';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private baseUrl = 'https://localhost:7179/api/Tickets'; // Adjust the URL if needed

  constructor(private http: HttpClient) {}

  createTicket(ticket: TicketDto): Observable<any> {
    return this.http.post(this.baseUrl, ticket);
  }

  getTickets(): Observable<TicketDto[]> {
    return this.http.get<TicketDto[]>(this.baseUrl);
  }
}
