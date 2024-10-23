import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicketService } from 'src/app/core/APIservices/ticket.service';
import { StatusService } from 'src/app/core/APIservices/status.service';
import { PriorityService } from 'src/app/core/APIservices/priority.service';
import { CategoryService } from 'src/app/core/APIservices/categories.service';
import { UserService } from 'src/app/core/APIservices/user.service';
import { Status } from 'src/app/core/models/status';
import { Priority } from 'src/app/core/models/priority';
import { Category } from 'src/app/core/models/category';
import { UserDto } from 'src/app/core/models/user.dto';

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
    userID: 0, // This will be set to the logged-in user's ID
    categoryID: 0,
  };
  statuses: Status[] = [];
  priorities: Priority[] = [];
  categories: Category[] = [];
  loggedInUser: UserDto | null = null; // To store logged-in user info
  loggedInUserName: string = ''; // To display the user's name
  userRole: string = ''; // To store the user's role

  constructor(
    private router: Router,
    private ticketService: TicketService,
    private statusService: StatusService,
    private priorityService: PriorityService,
    private categoryService: CategoryService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Fetch statuses, priorities, and categories
    this.statusService.getStatuses().subscribe((data: Status[]) => {
      this.statuses = data;
    });

    this.priorityService.getPriorities().subscribe((data: Priority[]) => {
      this.priorities = data;
    });

    this.categoryService.getCategories().subscribe((data: Category[]) => {
      this.categories = data;
    });

    // Get the logged-in user's ID from localStorage
    const userId = this.userService.getUserIdFromToken();
    this.userRole = localStorage.getItem('roleID') || ''; // Assuming roleID is stored in local storage

    if (userId) {
      this.ticket.userID = userId; // Set userID in the ticket object
      this.userService.getUserById(this.ticket.userID).subscribe({
        next: (user: UserDto) => {
          this.loggedInUser = user; // Store the logged-in user
          this.loggedInUserName = user.userName; // Get the username
          console.log('Fetched User:', this.loggedInUser);
          console.log('Logged In User Name:', this.loggedInUserName);
        },
        error: (error) => {
          console.error('Error fetching user:', error); // Handle errors here
        },
      });
    } else {
      console.warn('No user ID found in localStorage'); // Log warning when no user ID is found
    }
  }

  onSubmit() {
    this.ticketService.createTicket(this.ticket).subscribe({
      next: (response) => {
        console.log('Ticket created successfully', response);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error creating ticket', error);
      },
    });
  }
}
