import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { DashboardTableService } from './dashboard-table.service';
import { NgbdSortableHeader, SortEvent } from './sortable.directive';
import { ReportData } from 'src/app/core/models/reportWithTasks';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-table',
  templateUrl: './dashboard-table.component.html',
  styleUrls: ['./dashboard-table.component.css'],
  providers: [DashboardTableService, DecimalPipe],
})
export class DashboardTableComponent {
  weeks: number[] = [];
  reportData$!: Observable<ReportData[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;
  @ViewChildren('workWeekSelect')
  workWeekSelect!: ElementRef<HTMLSelectElement>;
  @ViewChildren('datePickerComponent') datePickerComponent!: ElementRef<any>;

  constructor(public service: DashboardTableService, private router: Router) {
    this.reportData$ = service.reportData$;
    this.total$ = service.total$;
    for (let i = 1; i <= 52; i++) {
      this.weeks.push(i);
    }
  }

  filterByDateRange(dateRange: { startDate: Date; endDate: Date }) {
    this.service.filterByDateRange(dateRange.startDate, dateRange.endDate);
  }

  setDateRange(startDate: Date, endDate: Date) {
    console.log('Received startDate:', startDate);
    console.log('Received endDate:', endDate);
    this.service.setDateRange(startDate, endDate);
  }

  clearFilters(): void {
    this.service.clearFilters();
    window.location.reload();
  }

  hasFiltersApplied(): boolean {
    return (
      this.service.searchTerm !== '' ||
      this.service.selectedWorkWeek !== undefined ||
      (this.service.startDate !== null && this.service.endDate !== null)
    );
  }

  onSort({ column, direction }: SortEvent) {
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  editTask(reportID: number) {
    this.router.navigate(['/edit-report', reportID]);
  }

  onWorkWeekChange(workWeek: string) {
    this.service.selectedWorkWeek = workWeek;
  }
}
