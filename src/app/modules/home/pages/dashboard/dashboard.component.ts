import {
  AfterViewInit,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/shared/components/toast/toast.service';

@Component({
  selector: 'app-home',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements AfterViewInit {
  @ViewChild('successTpl') successTpl!: TemplateRef<any>;
  @ViewChild('saved') saved!: TemplateRef<any>;
  reportStatus!: string;
  constructor(
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngAfterViewInit() {
    console.log('ngAfterViewInit called');
    this.route.queryParams.subscribe((params) => {
      const reportStatus = params['reportStatus'];
      console.log('Report status:', reportStatus);
      if (reportStatus === 'submitted') {
        this.triggerSuccessReport();
        console.log('Report successfully submitted');
      } else if (reportStatus === 'saved') {
        this.triggerSuccessSaving();
        console.log('Report successfully saved');
      }
    });
  }

  triggerSuccessReport() {
    this.toastService.showSuccess(this.successTpl);
  }

  triggerSuccessSaving() {
    this.toastService.showSuccess(this.saved);
  }
}
