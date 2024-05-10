import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ReportService } from 'src/app/core/APIservices/reports.service';
import {
  Task,
  ReportData,
  Category,
} from 'src/app/core/models/reportWithTasks';
import { TasksService } from 'src/app/core/APIservices/tasks.service';
import { CategoryService } from 'src/app/core/APIservices/categories.service';
import { formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Toast, ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.css'],
})
export class ReportFormComponent implements OnInit {
  @ViewChild('myForm') form!: NgForm;
  @ViewChild('successTpl') successTpl!: TemplateRef<any>;
  @ViewChild('dangerTpl') dangerTpl!: TemplateRef<any>;
  tasks: Task[] = [];
  deletedTasks: Task[] = [];
  categories: Category[] = [];
  workWeek: number | null = null;
  totalWorkHours: number = 0;
  submissionDateTime: string = '';
  ngSelect: number | null = null;
  workHour: number = 0;
  ngTask = '';
  isEditMode: boolean = false;
  editIndex: number | null = null;
  isSubmitting: boolean = true;
  @Input() reportID!: number;

  constructor(
    public ngxSmartModalService: NgxSmartModalService,
    private reportService: ReportService,
    private tasksService: TasksService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const reportID = +params['reportID'];
      if (reportID) {
        this.fetchReportDetails(reportID);
      }
    });
    const currentDate = new Date();
    this.workWeek = this.getWeekNumber(currentDate);
    this.getCategories();
  }

  fetchReportDetails(reportID: number) {
    // Fetch the report details based on the report ID
    this.reportService.getReportById(reportID).subscribe(
      (report: ReportData) => {
        // Assign fetched values to component properties
        this.workWeek = report.workWeek;
        this.tasks = report.tasks;
        this.submissionDateTime = report.submissionDateTime;
        this.calculateTotalWorkHours();
      },
      (error) => {
        console.error('Error fetching report details:', error);
      }
    );
  }

  getWeekNumber(date: Date): number {
    const newDate = new Date(date);
    newDate.setMonth(0, 1);
    const dayOfWeek = newDate.getDay();
    const daysToAdd = dayOfWeek > 1 ? 7 - dayOfWeek + 1 : 1 - dayOfWeek;
    newDate.setDate(newDate.getDate() + daysToAdd);
    const weekNumber = Math.ceil(
      ((date.valueOf() - newDate.valueOf()) / 86400000 + 1) / 7
    );
    return weekNumber;
  }

  preventTyping(event: KeyboardEvent) {
    event.preventDefault();
  }

  getCategories() {
    this.categoryService.getCategories().subscribe(
      (categories: Category[]) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  getCategoryName(categoryID: number): string {
    const category = this.categories.find(
      (cat) => cat.categoryID === categoryID
    );
    if (!category) {
      console.warn(`Category with ID ${categoryID} not found.`);
      return 'Unknown';
    }
    return category.categoryName;
  }

  addOrEditTask(form: NgForm) {
    const newTask: Task = {
      // Remove taskID when adding a new task
      workHour: +this.workHour!,
      categoryID: +this.ngSelect!,
      taskDescription: this.ngTask,
    };

    if (!form.valid) {
      this.triggerEmptyToast();
      return;
    }

    if (this.isEditMode && this.editIndex !== null) {
      // Update existing task in edit mode
      newTask.taskID = this.tasks[this.editIndex].taskID; // Assign existing taskID when editing
      this.tasks[this.editIndex] = newTask;
    } else {
      // Add new task in add mode
      this.tasks.push(newTask);
    }

    this.calculateTotalWorkHours();
    this.ngSelect = null;
    this.workHour = 0;
    this.ngTask = '';
    this.isEditMode = false; // Reset to add mode
    this.editIndex = null; // Reset edit index
    this.triggerSuccessToast();
    this.ngxSmartModalService.close('myModal');
  }

  triggerSuccessToast() {
    this.toastService.showSuccess(this.successTpl);
  }

  triggerEmptyToast() {
    this.toastService.showDanger(this.dangerTpl);
  }

  calculateTotalWorkHours() {
    let totalHours = 0;
    this.tasks.forEach((task) => {
      totalHours += task.workHour;
    });
    this.totalWorkHours = totalHours;
  }

  submitReport() {
    // Generate current date and time
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate, 'yyyy-MM-dd', 'en-US');
    // const formattedTime = formatDate(currentDate, 'hh:mm a', 'en-US');

    const reportData: ReportData = {
      reportID: 0,
      workWeek: this.workWeek || 0,
      totalWorkHour: this.totalWorkHours,
      tasks: this.tasks,
      // submissionDateTime: `${formattedDate} ${formattedTime}`, // Concatenate date and time
      submissionDateTime: formattedDate, // Only include the date
    };

    // Now you can use the reportData for submission
    this.reportService.submitReport(reportData).subscribe(
      (response) => {
        console.log('Report submitted successfully:', response);
        this.tasks = [];
        this.totalWorkHours = 0;
        this.router.navigate(['/dashboard'], {
          queryParams: { reportStatus: 'submitted' },
        });
      },
      (error) => {
        console.error('Error submitting report:', error);
      }
    );
  }

  saveReport() {
    if (this.deletedTasks.length > 0) {
      // If there are deleted tasks, delete each one
      this.deletedTasks.forEach((deletedTask) => {
        if (deletedTask.taskID !== undefined) {
          // Check if taskID is defined
          this.tasksService.deleteTask(deletedTask.taskID).subscribe(
            () => {
              console.log('Task deleted successfully:', deletedTask.taskID);
            },
            (error) => {
              console.error('Error deleting task:', error);
            }
          );
        } else {
          console.warn('TaskID is undefined for deleted task:', deletedTask);
        }
      });
    }

    const reportData: ReportData = {
      reportID: this.reportID || 0,
      workWeek: this.workWeek || 0,
      totalWorkHour: this.totalWorkHours,
      tasks: this.tasks.map((task) => ({
        taskID: task.taskID,
        workHour: task.workHour,
        categoryID: task.categoryID,
        taskDescription: task.taskDescription,
        category: this.categories.find(
          (cat) => cat.categoryID === task.categoryID
        ),
        reportID: this.reportID || 0,
      })),
      submissionDateTime: this.submissionDateTime,
    };

    // Check if reportID is available
    if (this.reportID) {
      // Update existing report
      this.reportService.updateReport(this.reportID, reportData).subscribe(
        (response) => {
          console.log('Report updated successfully:', response);

          // Check if there's a new task to add
          if (this.tasks.filter((task) => !task.taskID).length > 0) {
            // If there are new tasks, create each one
            this.tasks
              .filter((task) => !task.taskID)
              .forEach((newTask) => {
                // Ensure reportID is included
                newTask.reportID = this.reportID || 0;
                this.tasksService.createTask(newTask).subscribe(
                  (taskResponse) => {
                    console.log('New task added successfully:', taskResponse);
                  },
                  (taskError) => {
                    console.error('Error adding new task:', taskError);
                  }
                );
              });
          }

          this.router.navigate(['/dashboard'], {
            queryParams: { reportStatus: 'saved' },
          });
        },
        (error) => {
          console.error('Error updating report:', error);
        }
      );
    } else {
      // Submit new report
      this.reportService.submitReport(reportData).subscribe(
        (response) => {
          console.log('Report submitted successfully:', response);

          // Check if there's a new task to add
          if (this.tasks.filter((task) => !task.taskID).length > 0) {
            // If there are new tasks, create each one
            this.tasks
              .filter((task) => !task.taskID)
              .forEach((newTask) => {
                // Ensure reportID is included
                newTask.reportID = response.reportID; // Use the reportID from the response
                this.tasksService.createTask(newTask).subscribe(
                  (taskResponse) => {
                    console.log('New task added successfully:', taskResponse);
                  },
                  (taskError) => {
                    console.error('Error adding new task:', taskError);
                  }
                );
              });
          }

          this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.error('Error submitting report:', error);
        }
      );
    }
  }

  openConfirmationModal(isSubmitting: boolean) {
    this.isSubmitting = isSubmitting; // Set the flag based on the action
    this.ngxSmartModalService.getModal('confirmationModal').open();
  }

  closeConfirmationModal() {
    this.ngxSmartModalService.getModal('confirmationModal').close();
  }

  confirmAction() {
    if (this.isSubmitting) {
      this.submitReport();
    } else {
      this.saveReport();
    }
    this.closeConfirmationModal();
  }

  cancelAction() {
    this.closeConfirmationModal();
  }

  cancelReport() {
    this.router.navigate(['/dashboard']);
  }

  editTask(task: Task) {
    // Set the form fields with the task details
    this.ngSelect = task.categoryID;
    this.workHour = task.workHour;
    this.ngTask = task.taskDescription;

    // Set edit mode and save the index of the task being edited
    this.isEditMode = true;
    this.editIndex = this.tasks.indexOf(task);

    // Open the modal
    this.ngxSmartModalService.getModal('myModal').open();
  }

  deleteTask(task: Task) {
    const index = this.tasks.findIndex((t) => t === task);
    if (index !== -1) {
      // Move the task to be deleted into a separate array
      const deletedTask = this.tasks.splice(index, 1)[0];
      // Add the deleted task to a separate array to keep track of tasks to be deleted from the database
      this.deletedTasks.push(deletedTask);
      this.calculateTotalWorkHours();
    } else {
      console.error('Task not found:', task);
    }
  }

  closeModal() {
    this.ngxSmartModalService.close('myModal');
    this.isEditMode = false;
    this.ngSelect = null;
    this.workHour = 0;
    this.ngTask = '';
  }
}
