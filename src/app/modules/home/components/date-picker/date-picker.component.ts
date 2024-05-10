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
    startDate: Date;
    endDate: Date;
  }>();

  constructor() {}

  selectDateRange() {
    if (this.startDate && this.endDate) {
      this.dateRangeSelected.emit({
        startDate: this.startDate,
        endDate: this.endDate,
      });
    }
  }
}
