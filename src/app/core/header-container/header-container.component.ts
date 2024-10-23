import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-container',
  templateUrl: './header-container.component.html',
  styleUrls: ['./header-container.component.css'],
})
export class HeaderContainerComponent implements OnInit {
  userRole: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const roleID = localStorage.getItem('roleID');
    if (roleID === '1') {
      this.userRole = 'admin';
    } else if (roleID === '2') {
      this.userRole = 'agent';
    } else if (roleID === '3') {
      this.userRole = 'user';
    }
  }

  navigateToHome(): void {
    this.router.navigate(['/dashboard']);
  }

  navigateToCreateTicket(): void {
    this.router.navigate(['/create-report']);
  }

  navigateToCategories(): void {
    this.router.navigate(['/manage-categories']);
  }

  navigateToUserManagement(): void {
    this.router.navigate(['/user-management']);
  }

  navigateToReportStatistics(): void {
    this.router.navigate(['/report-statistics']);
  }
}
