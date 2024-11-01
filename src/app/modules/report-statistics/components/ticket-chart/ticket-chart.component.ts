import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TicketService } from 'src/app/core/APIservices/ticket.service';
import { TicketDto } from 'src/app/core/models/ticket.dto';
import { Status } from 'src/app/core/models/status';
import { Priority } from 'src/app/core/models/priority';
import { Category } from 'src/app/core/models/category';

@Component({
  selector: 'app-ticket-chart',
  templateUrl: './ticket-chart.component.html',
  styleUrls: ['./ticket-chart.component.css'],
})
export class TicketChartComponent implements OnInit {
  statusChartData: number[] = [];
  statusChartLabels: string[] = [];
  priorityChartData: number[] = [];
  priorityChartLabels: string[] = [];
  categoryChartData: number[] = [];
  categoryChartLabels: string[] = [];

  statusCounts: { name: string; count: number }[] = [];
  priorityCounts: { name: string; count: number }[] = [];
  categoryCounts: { name: string; count: number }[] = [];

  isLoading: boolean = true;

  constructor(
    private ticketService: TicketService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMetadata();
    this.loadTickets();
  }

  loadMetadata(): void {
    this.ticketService.getAllStatuses().subscribe((statuses: Status[]) => {
      this.statusChartLabels = statuses.map((status) => status.statusName);
      this.statusCounts = this.statusChartLabels.map((name) => ({
        name,
        count: 0,
      }));
    });

    this.ticketService
      .getAllPriorities()
      .subscribe((priorities: Priority[]) => {
        this.priorityChartLabels = priorities.map(
          (priority) => priority.priorityLevel
        );
        this.priorityCounts = this.priorityChartLabels.map((name) => ({
          name,
          count: 0,
        }));
      });

    this.ticketService
      .getAllCategories()
      .subscribe((categories: Category[]) => {
        this.categoryChartLabels = categories.map(
          (category) => category.categoryName
        );
        this.categoryCounts = this.categoryChartLabels.map((name) => ({
          name,
          count: 0,
        }));
      });
  }

  loadTickets(): void {
    this.ticketService.getTickets().subscribe((tickets: TicketDto[]) => {
      this.processTicketData(tickets);
      this.isLoading = false;
      this.cd.detectChanges();
    });
  }

  processTicketData(tickets: TicketDto[]): void {
    const statusCount: { [key: string]: number } = {};
    const priorityCount: { [key: string]: number } = {};
    const categoryCount: { [key: string]: number } = {};

    tickets.forEach((ticket) => {
      if (ticket.statusName) {
        statusCount[ticket.statusName] =
          (statusCount[ticket.statusName] || 0) + 1;
      }

      if (ticket.priorityName) {
        priorityCount[ticket.priorityName] =
          (priorityCount[ticket.priorityName] || 0) + 1;
      }

      if (ticket.categoryName) {
        categoryCount[ticket.categoryName] =
          (categoryCount[ticket.categoryName] || 0) + 1;
      }
    });

    this.statusCounts.forEach((status) => {
      status.count = statusCount[status.name] || 0;
    });
    this.statusChartData = this.statusCounts.map((status) => status.count);

    this.priorityCounts.forEach((priority) => {
      priority.count = priorityCount[priority.name] || 0;
    });
    this.priorityChartData = this.priorityCounts.map(
      (priority) => priority.count
    );

    this.categoryCounts.forEach((category) => {
      category.count = categoryCount[category.name] || 0;
    });
    this.categoryChartData = this.categoryCounts.map(
      (category) => category.count
    );
  }
}
