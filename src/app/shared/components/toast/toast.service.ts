import { Injectable, TemplateRef } from '@angular/core';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';

export interface Toast {
  template: TemplateRef<any>;
  classname?: string;
  delay?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: Toast[] = [];

  show(toast: Toast) {
    this.toasts.push(toast);
  }

  remove(toast: Toast) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  clear() {
    this.toasts.splice(0, this.toasts.length);
  }

  showSuccess(template: TemplateRef<any>) {
    this.show({
      template,
      classname: 'bg-success text-light',
      delay: 2500,
    });
  }

  showDanger(template: TemplateRef<any>) {
    this.show({
      template,
      classname: 'bg-danger text-light',
      delay: 2500,
    });
  }
}
