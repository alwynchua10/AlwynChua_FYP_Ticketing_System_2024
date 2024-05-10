import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-report',
  templateUrl: './edit-report.component.html',
  styleUrls: ['./edit-report.component.css'],
})
export class EditReportComponent implements OnInit {
  reportID!: number;

  constructor(private route: ActivatedRoute) {}

  //get report id from the dashboard module
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.reportID = +params['reportID'];
    });
  }
}
