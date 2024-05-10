import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  delay,
  switchMap,
  tap,
  map,
} from 'rxjs/operators';
import { ReportData } from 'src/app/core/models/reportWithTasks';
import { SortDirection } from './sortable.directive';

interface SearchResult {
  reportData: ReportData[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
  startDate?: Date;
  endDate?: Date;
  selectedWorkWeek?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardTableService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _reportData$ = new BehaviorSubject<ReportData[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private baseUrl = 'https://localhost:7179/api/Reports';
  startDate: number | null = null;
  endDate: number | null = null;

  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: 'reportID',
    sortDirection: 'desc',
  };

  constructor(private http: HttpClient) {
    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false))
      )
      .subscribe((result) => {
        this._reportData$.next(result.reportData);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  get reportData$() {
    return this._reportData$.asObservable();
  }

  get total$() {
    return this._total$.asObservable();
  }

  get loading$() {
    return this._loading$.asObservable();
  }

  get page() {
    return this._state.page;
  }

  get pageSize() {
    return this._state.pageSize;
  }

  get searchTerm() {
    return this._state.searchTerm;
  }

  set selectedWorkWeek(workWeek: string | undefined) {
    this._set({ selectedWorkWeek: workWeek });
  }

  set page(page: number) {
    this._set({ page });
  }

  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }

  set searchTerm(searchTerm: string) {
    this._set({ searchTerm });
  }

  set sortColumn(sortColumn: string) {
    this._set({ sortColumn });
  }

  set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection });
  }

  filterByDateRange(startDate: Date, endDate: Date) {
    // Update state with new start and end dates
    this._set({ startDate, endDate });
  }

  setDateRange(startDate: Date, endDate: Date) {
    console.log('Setting startDate in service:', startDate);
    console.log('Setting endDate in service:', endDate);
    this._set({ startDate, endDate });
  }

  clearFilters(): void {
    this._set({
      startDate: undefined,
      endDate: undefined,
      selectedWorkWeek: '',
      searchTerm: '',
    });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {
      sortColumn,
      sortDirection,
      pageSize,
      page,
      searchTerm,
      startDate,
      endDate,
      selectedWorkWeek,
    } = this._state;

    let url = `${this.baseUrl}?page=${page}&pageSize=${pageSize}&searchTerm=${searchTerm}&sortColumn=${sortColumn}&sortDirection=${sortDirection}`;
    url += `&startDate=${startDate ?? ''}&endDate=${endDate ?? ''}`;
    if (selectedWorkWeek) {
      url += `&workWeek=${selectedWorkWeek}`;
    }

    console.log('Request URL:', url);

    return this.http.get<ReportData[]>(url).pipe(
      catchError(() => of([])),
      map((reportData: ReportData[]) => {
        const filteredData = this._filter(reportData, searchTerm);
        const sortedData = this._sort(filteredData, sortColumn, sortDirection);
        const paginatedData = this._paginate(sortedData, page, pageSize);
        const total = filteredData.length;
        return { reportData: paginatedData, total };
      })
    );
  }

  private _filter(reportData: ReportData[], searchTerm: string): ReportData[] {
    if (!searchTerm.trim()) {
      return reportData;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return reportData.filter(
      (report) =>
        report.reportID.toString().includes(lowerCaseSearchTerm) ||
        `R${report.reportID.toString().padStart(5, '0')}`.includes(
          lowerCaseSearchTerm
        ) ||
        report.submissionDateTime.toLowerCase().includes(lowerCaseSearchTerm) ||
        report.workWeek.toString().includes(lowerCaseSearchTerm) ||
        report.totalWorkHour.toString().includes(lowerCaseSearchTerm)
    );
  }

  private _sort(
    reportData: ReportData[],
    sortColumn: string,
    sortDirection: SortDirection
  ): ReportData[] {
    if (!sortColumn || sortDirection === '') {
      return reportData;
    }

    return reportData.sort((a, b) => {
      let aValue = '';
      let bValue = '';

      switch (sortColumn) {
        case 'reportID':
          aValue = a.reportID.toString();
          bValue = b.reportID.toString();
          break;
        case 'submissionDateTime':
          aValue = a.submissionDateTime || '';
          bValue = b.submissionDateTime || '';
          break;
        case 'workWeek':
          aValue = String(a.workWeek);
          bValue = String(b.workWeek);
          break;
        case 'workHour':
          aValue = String(a.totalWorkHour);
          bValue = String(b.totalWorkHour);
          break;
        default:
          break;
      }

      const result = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortDirection === 'asc' ? result : -result;
    });
  }

  private _paginate(
    reportData: ReportData[],
    page: number,
    pageSize: number
  ): ReportData[] {
    const startIndex = (page - 1) * pageSize;
    return reportData.slice(startIndex, startIndex + pageSize);
  }
}
