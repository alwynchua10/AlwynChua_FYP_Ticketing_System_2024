import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { DashboardTableService } from './dashboard-table.service';
import { NgbdSortableHeader, SortEvent } from './sortable.directive';
import { TicketDto } from 'src/app/core/models/ticket.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-table',
  templateUrl: './dashboard-table.component.html',
  styleUrls: ['./dashboard-table.component.css'],
  providers: [DashboardTableService, DecimalPipe],
})
export class DashboardTableComponent {
  ticketData$!: Observable<TicketDto[]>;
  currentSortColumn: string = '';
  currentSortDirection: string = '';

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  constructor(public service: DashboardTableService, private router: Router) {
    this.ticketData$ = service.ticketData$;
  }

  ngOnInit(): void {
    const userId = localStorage.getItem('userID');
    const roleId = localStorage.getItem('roleID');

    if (userId && roleId) {
      this.service.setUserAndRole(+userId, +roleId);
    } else {
      console.error('No user ID or role ID found in local storage');
    }
  }

  setDateRange(startDate: Date | null, endDate: Date | null) {
    console.log('Received startDate:', startDate);
    console.log('Received endDate:', endDate);
    this.service.setDateRange(startDate, endDate);
  }

  clearFilters(): void {
    this.service.clearFilters();
    window.location.reload(); // Consider a smoother transition instead of reloading
  }

  hasFiltersApplied(): boolean {
    return (
      this.service.searchTerm !== '' ||
      (this.service.startDate !== null && this.service.endDate !== null)
    );
  }

  onSort({ column, direction }: SortEvent) {
    // If the current column and direction are the same, don't proceed
    if (
      this.currentSortColumn === column &&
      this.currentSortDirection === direction
    ) {
      return; // Prevent unnecessary sorting
    }

    // Reset other headers' directions
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // Update the current sorting state
    this.currentSortColumn = column;
    this.currentSortDirection = direction;

    // Sort only if the direction is 'asc' or 'desc'
    if (direction === 'asc' || direction === 'desc') {
      this.service.sort(column as keyof TicketDto, direction);
    }
  }

  isSorted(column: string): boolean {
    return this.currentSortColumn === column;
  }

  getSortIcon(column: string): string {
    if (this.currentSortColumn !== column) return '';

    return this.currentSortDirection === 'asc' ? '↑' : '↓'; // Up and down arrows
  }

  editTicket(ticketID: number) {
    this.router.navigate(['/edit-ticket', ticketID]);
  }
}
