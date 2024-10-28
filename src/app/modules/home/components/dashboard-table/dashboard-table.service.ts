import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { TicketDto } from 'src/app/core/models/ticket.dto';

@Injectable({
  providedIn: 'root',
})
export class DashboardTableService {
  private apiUrl = 'https://localhost:7179/api/Tickets';
  private ticketDataSubject = new BehaviorSubject<TicketDto[]>([]);
  ticketData$: Observable<TicketDto[]> = this.ticketDataSubject.asObservable();
  public searchTerm: string = '';
  public startDate: Date | null = null;
  public endDate: Date | null = null;
  public sortColumn: keyof TicketDto | null = null;
  public sortDirection: 'asc' | 'desc' | null = null;
  public loading$ = new BehaviorSubject<boolean>(false);
  private userId: number | null = null;
  private roleId: number | null = null;

  constructor(private http: HttpClient) {}

  setUserAndRole(userId: number, roleId: number) {
    this.userId = userId;
    this.roleId = roleId;
    this.fetchTickets();
  }

  private fetchTickets() {
    this.loading$.next(true);
    const url =
      this.userId && this.roleId
        ? `${this.apiUrl}?userId=${this.userId}&roleId=${this.roleId}`
        : this.apiUrl;

    this.http.get<TicketDto[]>(url).subscribe(
      (tickets) => {
        // Sort tickets by SubmissionDate in descending order
        tickets.sort((a, b) => {
          const aDate = a.submissionDate
            ? new Date(a.submissionDate).getTime()
            : 0;
          const bDate = b.submissionDate
            ? new Date(b.submissionDate).getTime()
            : 0;
          return bDate - aDate; // Newest first
        });
        this.ticketDataSubject.next(tickets);
        this.loading$.next(false);
      },
      (error) => {
        console.error('Error fetching tickets:', error);
        this.loading$.next(false);
      }
    );
  }

  public setDateRange(startDate: Date | null, endDate: Date | null) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.applyFilters();
  }

  public clearFilters() {
    this.searchTerm = '';
    this.startDate = null;
    this.endDate = null;
    this.applyFilters();
  }

  private applyFilters() {
    this.ticketData$.subscribe((tickets) => {
      let filteredTickets = [...tickets];

      // Filter based on search term
      if (this.searchTerm) {
        filteredTickets = filteredTickets.filter(
          (ticket) =>
            ticket.title
              .toLowerCase()
              .includes(this.searchTerm.toLowerCase()) ||
            ticket.description
              .toLowerCase()
              .includes(this.searchTerm.toLowerCase())
        );
      }

      // Filter based on date range
      if (this.startDate && this.endDate) {
        filteredTickets = filteredTickets.filter((ticket) => {
          if (ticket.submissionDate) {
            const submissionDate = new Date(ticket.submissionDate);
            return (
              this.startDate instanceof Date &&
              !isNaN(this.startDate.getTime()) &&
              this.endDate instanceof Date &&
              !isNaN(this.endDate.getTime()) &&
              submissionDate >= this.startDate &&
              submissionDate <= this.endDate
            );
          }
          return false; // Exclude tickets without a submissionDate
        });
      }

      // Sorting
      if (this.sortColumn) {
        filteredTickets.sort((a, b) => {
          const aValue = a[this.sortColumn as keyof TicketDto];
          const bValue = b[this.sortColumn as keyof TicketDto];

          if (this.sortDirection === 'asc') {
            return this.compareValues(aValue, bValue);
          } else {
            return this.compareValues(bValue, aValue);
          }
        });
      }

      this.ticketDataSubject.next(filteredTickets);
    });
  }

  private compareValues(a: any, b: any): number {
    if (a === undefined && b === undefined) return 0;
    if (a === undefined) return 1;
    if (b === undefined) return -1;

    if (typeof a === 'string' && typeof b === 'string') {
      return a.localeCompare(b);
    } else {
      return a > b ? 1 : -1;
    }
  }

  public sort(column: keyof TicketDto, direction: 'asc' | 'desc') {
    this.sortColumn = column;
    this.sortDirection = direction;
    this.applyFilters();
  }

  public createTicket(ticket: TicketDto): Observable<TicketDto> {
    return this.http.post<TicketDto>(this.apiUrl, ticket).pipe(
      map((newTicket) => {
        this.fetchTickets(); // Refresh the ticket list after creation
        return newTicket;
      })
    );
  }

  public updateTicket(
    ticketID: number,
    ticketData: TicketDto
  ): Observable<TicketDto> {
    return this.http
      .put<TicketDto>(`${this.apiUrl}/${ticketID}`, ticketData)
      .pipe(
        map((updatedTicket) => {
          this.fetchTickets(); // Refresh the ticket list after update
          return updatedTicket;
        })
      );
  }

  public deleteTicket(ticketID: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${ticketID}`).pipe(
      map(() => {
        this.fetchTickets(); // Refresh the ticket list after deletion
      })
    );
  }

  getTicketById(ticketID: number): Observable<TicketDto> {
    return this.http.get<TicketDto>(`${this.apiUrl}/${ticketID}`);
  }
}
