import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketChartComponent } from './ticket-chart.component';

describe('TicketChartComponent', () => {
  let component: TicketChartComponent;
  let fixture: ComponentFixture<TicketChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TicketChartComponent]
    });
    fixture = TestBed.createComponent(TicketChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
