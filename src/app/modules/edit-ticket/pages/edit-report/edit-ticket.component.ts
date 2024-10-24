import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-ticket',
  templateUrl: './edit-ticket.component.html',
  styleUrls: ['./edit-ticket.component.css'],
})
export class EditTicketComponent implements OnInit {
  reportID!: number;

  constructor(private route: ActivatedRoute) {}

  //get report id from the dashboard module
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.reportID = +params['reportID'];
    });
  }
}
