import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
})
export class DatePickerComponent {
  startDate: Date | undefined;
  endDate: Date | undefined;

  @Output() dateRangeSelected = new EventEmitter<{
    startDate: Date | null;
    endDate: Date | null;
  }>();

  constructor() {}

  selectDateRange() {
    if (this.startDate && this.endDate) {
      // Emit as Date objects
      this.dateRangeSelected.emit({
        startDate: new Date(this.startDate),
        endDate: new Date(this.endDate),
      });
    }
  }

  // Optional: Method to clear the date range
  clearDateRange() {
    this.startDate = undefined;
    this.endDate = undefined;
    this.dateRangeSelected.emit({ startDate: null, endDate: null });
  }
}
