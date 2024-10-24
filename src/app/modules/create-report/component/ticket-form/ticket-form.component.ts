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
    userID: 0, // Set to the logged-in user's ID or selected user's ID
    categoryID: 0,
  };
  statuses: Status[] = [];
  priorities: Priority[] = [];
  categories: Category[] = [];
  loggedInUser: UserDto | null = null; // To store logged-in user info
  loggedInUserName: string = ''; // To display the logged-in user's name
  userRole: string = ''; // To store the logged-in user's role
  userSearchTerm: string = '';
  userSuggestions: UserDto[] = []; // Store fetched user suggestions

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
      // Set the default statusID to the first fetched status if available
      if (this.statuses.length > 0) {
        this.ticket.statusID = this.statuses[0].statusID; // Set to the first status
      }
    });

    this.priorityService.getPriorities().subscribe((data: Priority[]) => {
      this.priorities = data;
      // Set the default priorityID to the first fetched priority if available
      if (this.priorities.length > 0) {
        this.ticket.priorityID = this.priorities[0].priorityID; // Set to the first priority
      }
    });

    this.categoryService.getCategories().subscribe((data: Category[]) => {
      this.categories = data;
      // Set the default categoryID to the first fetched category if available
      if (this.categories.length > 0) {
        this.ticket.categoryID = this.categories[0].categoryID; // Set to the first category
      }
    });

    // Get the logged-in user's ID and role from localStorage
    const userId = this.userService.getUserIdFromToken();
    this.userRole = localStorage.getItem('roleID') || ''; // Get the role ID from localStorage

    if (userId) {
      this.ticket.userID = userId; // Set userID in the ticket object
      this.userService.getUserById(this.ticket.userID).subscribe({
        next: (user: UserDto) => {
          this.loggedInUser = user; // Store the logged-in user
          if (this.userRole === '1' || this.userRole === '2') {
            this.loggedInUserName = ''; // Admin/agent's input starts empty
          } else {
            this.loggedInUserName = user.userName; // Regular user's name is pre-filled
          }
        },
        error: (error) => {
          console.error('Error fetching user:', error); // Handle errors here
        },
      });
    } else {
      console.warn('No user ID found in localStorage'); // Log warning when no user ID is found
    }
  }

  // Handle user search only for admins/agents (RoleID 1 or 2)
  onUserSearch() {
    if (
      (this.userRole === '1' || this.userRole === '2') &&
      this.loggedInUserName.length > 0
    ) {
      this.userService.searchUsers(this.loggedInUserName).subscribe({
        next: (users: UserDto[]) => {
          this.userSuggestions = users; // Store the suggestions
        },
        error: (error) => {
          console.error('Error fetching user suggestions:', error);
        },
      });
    } else {
      this.userSuggestions = []; // Clear suggestions if input is empty or user is not an admin/agent
    }
  }

  // Select user from suggestions (admin/agent only)
  selectUser(user: UserDto) {
    this.loggedInUserName = user.userName; // Set the input field to the selected user's name
    this.ticket.userID = user.userID ?? 0; // Set the selected user's ID
    this.userSuggestions = []; // Clear suggestions after selection
  }

  onSubmit() {
    if (this.ticket.userID === 0) {
      console.warn('No user selected for the ticket');
      return;
    }

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
