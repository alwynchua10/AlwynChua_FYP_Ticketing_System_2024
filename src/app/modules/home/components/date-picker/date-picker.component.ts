import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
})
export class DatePickerComponent {
  startDateString: string | undefined; // Store date as string in 'yyyy-MM-dd' format
  endDateString: string | undefined; // Store date as string in 'yyyy-MM-dd' format

  startDate: Date | undefined; // Store date as Date object
  endDate: Date | undefined; // Store date as Date object

  @Output() dateRangeSelected = new EventEmitter<{
    startDate: Date | null;
    endDate: Date | null;
  }>();

  constructor() {}

  onStartDateChange(event: string) {
    this.startDateString = event;
    this.startDate = this.startDateString
      ? new Date(this.startDateString)
      : undefined;
    this.selectDateRange(); // Emit the new date range
  }

  onEndDateChange(event: string) {
    this.endDateString = event;
    this.endDate = this.endDateString
      ? new Date(this.endDateString)
      : undefined;
    this.selectDateRange(); // Emit the new date range
  }

  getMinEndDate(): string | null {
    return this.startDate && !isNaN(this.startDate.getTime())
      ? this.startDate.toISOString().split('T')[0]
      : null;
  }

  selectDateRange() {
    this.dateRangeSelected.emit({
      startDate: this.startDate ? new Date(this.startDate) : null,
      endDate: this.endDate ? new Date(this.endDate) : null,
    });
  }

  resetDates() {
    this.startDate = undefined;
    this.endDate = undefined;
    this.startDateString = undefined; // Reset the string representation
    this.endDateString = undefined; // Reset the string representation

    // Emit null dates to clear the selection in the parent component
    this.selectDateRange(); // This emits the cleared date range
  }
}
