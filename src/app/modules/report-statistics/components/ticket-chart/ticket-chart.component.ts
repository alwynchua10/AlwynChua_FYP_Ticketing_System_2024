import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TicketService } from 'src/app/core/APIservices/ticket.service';
import { TicketDto } from 'src/app/core/models/ticket.dto';

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

  statusCounts: { name: string; count: number }[] = []; // To hold status counts
  priorityCounts: { name: string; count: number }[] = []; // To hold priority counts
  categoryCounts: { name: string; count: number }[] = []; // To hold category counts

  isLoading: boolean = true; // Loading state

  statusChartOptions: any = {
    chart: {
      type: 'pie',
    },
    labels: this.statusChartLabels,
  };

  priorityChartOptions: any = {
    chart: {
      type: 'pie',
    },
    labels: this.priorityChartLabels,
  };

  categoryChartOptions: any = {
    chart: {
      type: 'pie',
    },
    labels: this.categoryChartLabels,
  };

  constructor(
    private ticketService: TicketService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.ticketService.getTickets().subscribe((tickets: TicketDto[]) => {
      this.processTicketData(tickets);
      this.isLoading = false; // Set loading to false after data is processed
      this.cd.detectChanges(); // Trigger change detection
    });
  }

  processTicketData(tickets: TicketDto[]): void {
    const statusCount: { [key: string]: number } = {};
    const priorityCount: { [key: string]: number } = {};
    const categoryCount: { [key: string]: number } = {};

    tickets.forEach((ticket) => {
      // Count status
      const statusName = ticket.statusName || 'Unknown';
      statusCount[statusName] = (statusCount[statusName] || 0) + 1;

      // Count priority
      const priorityName = ticket.priorityName || 'Unknown';
      priorityCount[priorityName] = (priorityCount[priorityName] || 0) + 1;

      // Count category
      const categoryName = ticket.categoryName || 'Unknown';
      categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
    });

    this.statusChartLabels = Object.keys(statusCount);
    this.statusChartData = Object.values(statusCount);
    this.statusCounts = Object.keys(statusCount).map((key) => ({
      name: key,
      count: statusCount[key],
    }));

    this.priorityChartLabels = Object.keys(priorityCount);
    this.priorityChartData = Object.values(priorityCount);
    this.priorityCounts = Object.keys(priorityCount).map((key) => ({
      name: key,
      count: priorityCount[key],
    }));

    this.categoryChartLabels = Object.keys(categoryCount);
    this.categoryChartData = Object.values(categoryCount);
    this.categoryCounts = Object.keys(categoryCount).map((key) => ({
      name: key,
      count: categoryCount[key],
    }));
  }
}
