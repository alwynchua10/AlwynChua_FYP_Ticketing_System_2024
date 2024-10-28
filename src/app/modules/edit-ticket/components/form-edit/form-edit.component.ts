import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardTableService } from 'src/app/modules/home/components/dashboard-table/dashboard-table.service';
import { TicketDto } from 'src/app/core/models/ticket.dto';
import { StatusService } from 'src/app/core/APIservices/status.service';
import { PriorityService } from 'src/app/core/APIservices/priority.service';
import { CategoryService } from 'src/app/core/APIservices/categories.service';
import { CommentService } from 'src/app/core/APIservices/comment.service'; // Import CommentService
import { Status } from 'src/app/core/models/status';
import { Priority } from 'src/app/core/models/priority';
import { Category } from 'src/app/core/models/category';
import { CommentDto } from 'src/app/core/models/CommentDto';

@Component({
  selector: 'app-form-edit',
  templateUrl: './form-edit.component.html',
  styleUrls: ['./form-edit.component.css'],
})
export class FormEditComponent implements OnInit {
  editTicketForm: TicketDto = {
    title: '',
    description: '',
    statusID: 0,
    priorityID: 0,
    userID: 0,
    categoryID: 0,
    userName: '',
  };
  newComment: CommentDto = {
    text: '',
    ticketID: 0, // Will set this when submitting
    commentImage: '',
  };
  comments: CommentDto[] = []; // To store comments
  statuses: Status[] = [];
  priorities: Priority[] = [];
  categories: Category[] = [];
  ticketID!: number;

  // Variables for image preview
  isImagePreviewVisible = false;
  selectedImage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardTableService,
    private statusService: StatusService,
    private priorityService: PriorityService,
    private categoryService: CategoryService,
    private commentService: CommentService // Inject CommentService
  ) {}

  ngOnInit(): void {
    this.ticketID = +(this.route.snapshot.paramMap.get('id') || 0);
    this.fetchDropdownData();
    this.fetchTicketData();
    this.fetchComments(); // Fetch comments on init
  }

  get formattedTicketID(): string {
    return `TICK${this.ticketID}`;
  }

  set formattedTicketID(value: string) {
    const numericValue = parseInt(value.replace('TICK', ''), 10);
    this.ticketID = isNaN(numericValue) ? 0 : numericValue;
  }

  fetchDropdownData() {
    this.statusService.getStatuses().subscribe((data: Status[]) => {
      this.statuses = data;
    });

    this.priorityService.getPriorities().subscribe((data: Priority[]) => {
      this.priorities = data;
    });

    this.categoryService.getCategories().subscribe((data: Category[]) => {
      this.categories = data;
    });
  }

  fetchTicketData() {
    this.dashboardService.getTicketById(this.ticketID).subscribe(
      (data: TicketDto) => {
        this.editTicketForm = {
          ...data,
          userName: data.userName || '',
        };
      },
      (error) => {
        console.error('Error fetching ticket', error);
      }
    );
  }

  fetchComments() {
    this.commentService.getComments(this.ticketID).subscribe(
      (data: CommentDto[]) => {
        this.comments = data;
      },
      (error) => {
        console.error('Error fetching comments', error);
      }
    );
  }

  onSubmit(): void {
    const { submissionDate, ...ticketData } = this.editTicketForm;
    this.dashboardService.updateTicket(this.ticketID, ticketData).subscribe(
      () => {
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error('Error updating ticket', error);
      }
    );
  }

  submitComment(): void {
    this.newComment.ticketID = this.ticketID; // Set ticket ID for the comment
    this.commentService.postComment(this.newComment).subscribe(
      () => {
        this.fetchComments(); // Refresh comments after submitting
        this.newComment.text = ''; // Clear the comment input
        this.newComment.commentImage = ''; // Clear the image input
      },
      (error) => {
        console.error('Error submitting comment', error);
      }
    );
  }

  async openImagePreview(imageData: string | Blob): Promise<void> {
    if (typeof imageData === 'string') {
      this.selectedImage = 'data:image/png;base64,' + imageData; // If it's already a string
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(imageData); // Convert Blob to Data URL
      reader.onloadend = () => {
        this.selectedImage = reader.result as string; // Set the selected image
      };
    }
    this.isImagePreviewVisible = true; // Show the modal
  }

  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.newComment.commentImage = e.target?.result as string; // Store the image path/URL
      };
      reader.readAsDataURL(file);
    }
  }

  // Function to close the image preview
  closeImagePreview(): void {
    this.isImagePreviewVisible = false; // Hide the modal
    this.selectedImage = null; // Reset selected image
  }
}
