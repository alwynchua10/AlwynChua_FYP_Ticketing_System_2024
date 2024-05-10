import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportStatisticsComponent } from './report-statistics.component';

describe('ReportStatisticsComponent', () => {
  let component: ReportStatisticsComponent;
  let fixture: ComponentFixture<ReportStatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportStatisticsComponent]
    });
    fixture = TestBed.createComponent(ReportStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
