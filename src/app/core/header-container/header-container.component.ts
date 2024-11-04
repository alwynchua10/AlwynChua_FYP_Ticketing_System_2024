import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UserService } from '../APIservices/user.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header-container',
  templateUrl: './header-container.component.html',
  styleUrls: ['./header-container.component.css'],
})
export class HeaderContainerComponent implements OnInit {
  userRole: string = '';
  userName: string = 'User'; // Placeholder before data loads
  currentPage: string = '';

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    // Determine user role from local storage
    const roleID = localStorage.getItem('roleID');
    if (roleID === '1') {
      this.userRole = 'admin';
    } else if (roleID === '2') {
      this.userRole = 'agent';
    } else if (roleID === '3') {
      this.userRole = 'user';
    }

    // Fetch user name using the stored user ID
    const userID = localStorage.getItem('userID');
    if (userID) {
      this.userService.getUserById(+userID).subscribe(
        (user) => {
          this.userName = user.userName; // Make sure the property matches the API response
        },
        (error) => {
          console.error('Error fetching user details:', error);
        }
      );
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
