import {
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { DashboardTableService } from './dashboard-table.service';
import { NgbdSortableHeader, SortEvent } from './sortable.directive';
import { TicketDto } from 'src/app/core/models/ticket.dto';
import { Router } from '@angular/router';
import { DatePickerComponent } from '../date-picker/date-picker.component';

@Component({
  selector: 'app-dashboard-table',
  templateUrl: './dashboard-table.component.html',
  styleUrls: ['./dashboard-table.component.css'],
  providers: [DashboardTableService, DecimalPipe],
})
export class DashboardTableComponent {
  @ViewChild(DatePickerComponent) datePicker!: DatePickerComponent;
  ticketData$!: Observable<TicketDto[]>;
  currentSortColumn: string = '';
  currentSortDirection: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalTickets: number = 0;

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

    this.service.ticketData$.subscribe((tickets) => {
      this.totalTickets = tickets.length;
    });

    this.service.totalTickets$.subscribe((total) => {
      this.totalTickets = total;
    });
  }

  setDateRange(startDate: Date | null, endDate: Date | null) {
    console.log('Received startDate:', startDate);
    console.log('Received endDate:', endDate);
    this.service.setDateRange(startDate, endDate);
    this.updateTickets();
  }

  clearFilters(): void {
    this.service.clearFilters();
    this.datePicker.resetDates();
    this.updateTickets();
  }

  hasFiltersApplied(): boolean {
    return (
      this.service.searchTerm !== '' ||
      (this.service.startDate !== null && this.service.endDate !== null)
    );
  }

  onSort({ column, direction }: SortEvent) {
    if (
      this.currentSortColumn === column &&
      this.currentSortDirection === direction
    ) {
      return;
    }
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.currentSortColumn = column;
    this.currentSortDirection = direction;

    if (direction === 'asc' || direction === 'desc') {
      this.service.sort(column as keyof TicketDto, direction);
      this.updateTickets();
    }
  }

  isSorted(column: string): boolean {
    return this.currentSortColumn === column;
  }

  getSortIcon(column: string): string {
    if (this.currentSortColumn !== column) return '';

    return this.currentSortDirection === 'asc' ? '↑' : '↓';
  }

  editTicket(ticketID: number) {
    this.router.navigate(['/edit-ticket', ticketID]);
  }

  // pagination
  updateTickets() {
    this.service.applyFilters();
    this.service.changePage(this.currentPage, this.itemsPerPage);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.service.changePage(this.currentPage, this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.totalTickets / this.itemsPerPage);
  }
}
