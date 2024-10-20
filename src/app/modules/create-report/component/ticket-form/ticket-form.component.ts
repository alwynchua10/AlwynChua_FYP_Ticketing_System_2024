import { Component, OnInit } from '@angular/core';
import { TicketService } from 'src/app/core/APIservices/ticket.service';
import { StatusService } from 'src/app/core/APIservices/status.service';
import { PriorityService } from 'src/app/core/APIservices/priority.service';
import { CategoryService } from 'src/app/core/APIservices/categories.service';
import { UserService } from 'src/app/core/APIservices/user.service';
import { Status } from 'src/app/core/models/status';
import { Priority } from 'src/app/core/models/priority';
import { Category } from 'src/app/core/models/category';

@Component({
  selector: 'app-ticket-form',
  templateUrl: './ticket-form.component.html',
  styleUrls: ['./ticket-form.component.css'],
})
export class TicketFormComponent implements OnInit {
  ticket = {
    title: '',
    description: '',
    statusID: 0,
    priorityID: 0,
    userID: 1, // Set this to the logged-in user's ID
    categoryID: 0,
  };
  statuses: Status[] = []; // Define the type for statuses
  priorities: Priority[] = []; // Define the type for priorities
  categories: Category[] = []; // Define the type for categories

  constructor(
    private ticketService: TicketService,
    private statusService: StatusService,
    private priorityService: PriorityService,
    private categoryService: CategoryService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.statusService.getStatuses().subscribe((data: Status[]) => {
      this.statuses = data;
    });

    this.priorityService.getPriorities().subscribe((data: Priority[]) => {
      this.priorities = data;
    });

    this.categoryService.getCategories().subscribe((data: Category[]) => {
      this.categories = data;
    });
  }

  onSubmit() {
    this.ticketService.createTicket(this.ticket).subscribe({
      next: (response) => {
        console.log('Ticket created successfully', response);
      },
      error: (error) => {
        console.error('Error creating ticket', error);
      },
    });
  }
}
