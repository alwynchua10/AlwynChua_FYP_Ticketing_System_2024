import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TicketDto } from 'src/app/core/models/ticket.dto';

@Injectable({
  providedIn: 'root',
})
export class DashboardTableService {
  private apiUrl = 'https://localhost:7179/api/Tickets';
  private ticketDataSubject = new BehaviorSubject<TicketDto[]>([]);
  ticketData$: Observable<TicketDto[]> = this.ticketDataSubject.asObservable();
  public totalSubject = new BehaviorSubject<number>(0);
  public total$ = this.totalSubject.asObservable();
  public searchTerm: string = '';
  public startDate: Date | null = null;
  public endDate: Date | null = null;
  public sortColumn: keyof TicketDto | null = null;
  public sortDirection: 'asc' | 'desc' | null = null;
  public page: number = 1;
  public pageSize: number = 10;
  public loading$ = new BehaviorSubject<boolean>(false);
  private userId: number | null = null;

  constructor(private http: HttpClient) {
    // Removed fetchTickets() from constructor to prevent fetching all tickets initially
  }

  // Set user ID and fetch tickets accordingly
  setUserId(userId: number) {
    this.userId = userId;
    this.fetchTickets(); // Fetch tickets for the user
  }

  private fetchTickets() {
    this.loading$.next(true);
    const url = this.userId
      ? `${this.apiUrl}?userId=${this.userId}`
      : this.apiUrl; // Use user ID in URL if available

    this.http.get<TicketDto[]>(url).subscribe(
      (tickets) => {
        this.ticketDataSubject.next(tickets);
        this.totalSubject.next(tickets.length);
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
    this.ticketDataSubject.subscribe((tickets: TicketDto[]) => {
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
          const aValue = a[this.sortColumn as keyof TicketDto]; // Type assertion
          const bValue = b[this.sortColumn as keyof TicketDto]; // Type assertion

          if (aValue === undefined && bValue === undefined) return 0; // Both are undefined
          if (aValue === undefined) return 1; // Consider undefined to be greater
          if (bValue === undefined) return -1; // Consider undefined to be lesser

          if (this.sortDirection === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });
      }

      // Implement Pagination
      const startIndex = (this.page - 1) * this.pageSize;
      const paginatedTickets = filteredTickets.slice(
        startIndex,
        startIndex + this.pageSize
      );

      this.totalSubject.next(filteredTickets.length); // Update total count after filtering
      this.ticketDataSubject.next(paginatedTickets);
    });
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

  public updateTicket(ticket: TicketDto): Observable<TicketDto> {
    return this.http
      .put<TicketDto>(`${this.apiUrl}/${ticket.ticketID}`, ticket)
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
}
