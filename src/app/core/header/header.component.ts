import { Component } from '@angular/core';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { UserService } from '../APIservices/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  faSignOut = faSignOut;

  constructor(private router: Router, private userService: UserService) {} // Inject UserService

  onClick() {
    this.userService.logout(); // Call the logout method
    this.router.navigate(['/login']); // Redirect to the login page
  }
}
