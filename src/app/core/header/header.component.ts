import { Component } from '@angular/core';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  faSignOut = faSignOut;

  constructor(private router: Router) {} // Inject Router

  onClick() {
    // Clear the auth token from local storage
    localStorage.removeItem('authToken');

    // Redirect to the login page
    this.router.navigate(['/login']);
  }
}
