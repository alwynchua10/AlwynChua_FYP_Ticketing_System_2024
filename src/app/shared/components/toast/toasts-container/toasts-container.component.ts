import { Component } from '@angular/core';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-toasts-container',
  templateUrl: './toasts-container.component.html',
  styleUrls: ['./toasts-container.component.css'],
})
export class ToastsContainerComponent {
  constructor(public toastService: ToastService) {}
}
