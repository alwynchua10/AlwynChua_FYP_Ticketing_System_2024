import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [FontAwesomeModule],
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  faCircleInfo = faCircleInfo;

  constructor(private router: Router) {}
}
