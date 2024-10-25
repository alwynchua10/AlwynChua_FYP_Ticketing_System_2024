import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { DashboardTableService } from 'src/app/modules/home/components/dashboard-table/dashboard-table.service';
import { TicketDto } from 'src/app/core/models/ticket.dto';
import { StatusService } from 'src/app/core/APIservices/status.service';
import { PriorityService } from 'src/app/core/APIservices/priority.service';
import { CategoryService } from 'src/app/core/APIservices/categories.service';
import { UserService } from 'src/app/core/APIservices/user.service';
import { Status } from 'src/app/core/models/status';
import { Priority } from 'src/app/core/models/priority';
import { Category } from 'src/app/core/models/category';
import { UserDto } from 'src/app/core/models/user.dto';

@Component({
  selector: 'app-form-edit',
  templateUrl: './form-edit.component.html',
  styleUrls: ['./form-edit.component.css'],
})
export class FormEditComponent implements OnInit {
  editTicketForm: TicketDto = {
    title: '',
    description: '',
    statusID: 0,
    priorityID: 0,
    userID: 0,
    categoryID: 0,
  };
  statuses: Status[] = [];
  priorities: Priority[] = [];
  categories: Category[] = [];
  ticketID!: number; // Ticket ID from route

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardTableService,
    private statusService: StatusService,
    private priorityService: PriorityService,
    private categoryService: CategoryService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Get the ticket ID from the route
    this.ticketID = +(this.route.snapshot.paramMap.get('id') || 0);

    // Fetch statuses, priorities, and categories
    this.fetchDropdownData();

    // Fetch the existing ticket data
    this.dashboardService.getTicketById(this.ticketID).subscribe(
      (data: TicketDto) => {
        this.editTicketForm = data; // Directly assign fetched ticket data
      },
      (error) => {
        console.error('Error fetching ticket', error);
      }
    );
  }

  fetchDropdownData() {
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

  onSubmit(): void {
    this.dashboardService
      .updateTicket(this.ticketID, this.editTicketForm)
      .subscribe(
        () => {
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.error('Error updating ticket', error);
        }
      );
  }
}
