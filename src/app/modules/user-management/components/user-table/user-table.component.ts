import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { UserService } from 'src/app/core/APIservices/user.service'; // Ensure this points to your service
import { UserDto } from 'src/app/core/models/user.dto';
import { ToastService } from 'src/app/shared/components/toast/toast.service';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css'],
})
export class UserTableComponent implements OnInit {
  @ViewChild('myForm') form!: NgForm;
  @ViewChild('successTpl') successTpl!: TemplateRef<any>;
  @ViewChild('editTpl') editTpl!: TemplateRef<any>;
  @ViewChild('deleteTpl') deleteTpl!: TemplateRef<any>;
  @ViewChild('dangerTpl') dangerTpl!: TemplateRef<any>;

  userToDeleteId: number | undefined;
  data: UserDto[] = [];
  editMode = false;
  editUser: UserDto | null = null;
  ngUser: UserDto = { UserName: '', UserEmail: '', RoleID: null }; // Initialize a UserDto object
  isLoading = false;

  constructor(
    public ngxSmartModalService: NgxSmartModalService,
    private userService: UserService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadUsers(); // Load users when the component initializes
  }

  loadUsers() {
    this.isLoading = true; // Set isLoading to true when loading starts
    this.userService.getUsers().subscribe(
      (data: any[]) => {
        console.log('Fetched users:', data); // Log the data here
        this.data = data.map((user) => ({
          UserId: user.UserId, // Use the original property names
          UserName: user.UserName, // Correctly map UserName
          UserEmail: user.UserEmail, // Correctly map UserEmail
          RoleID: user.RoleID || null, // Map RoleID if available
        }));
        this.isLoading = false; // Set isLoading to false when loading is complete
      },
      (error) => {
        console.error('Error fetching users:', error);
        this.isLoading = false; // Set isLoading to false in case of error
      }
    );
  }

  addUser(form: NgForm) {
    if (form.invalid) {
      this.triggerEmptyToast();
      return;
    }

    if (this.editUser && this.editUser.UserId) {
      this.userService.updateUser(this.editUser.UserId, this.ngUser).subscribe(
        () => {
          this.loadUsers();
          this.closeModal();
          this.triggerSuccessEdit();
        },
        (error) => {
          console.error('Error updating user:', error);
        }
      );
    } else {
      this.userService.register(this.ngUser).subscribe(
        () => {
          this.loadUsers();
          this.closeModal();
          this.triggerSuccessCreate();
        },
        (error) => {
          console.error('Error adding user:', error);
        }
      );
    }
    this.editMode = false;
    this.ngUser = { UserName: '', UserEmail: '', RoleID: null }; // Reset ngUser after save
  }

  onEdit(user: UserDto) {
    this.editMode = true;
    this.ngUser = { ...user }; // Spread the user object to ngUser for editing
    this.ngxSmartModalService.open('myModal');
  }

  openConfirmationModal(userId: number) {
    this.ngxSmartModalService.getModal('confirmationModal').open();
    this.userToDeleteId = userId;
  }

  deleteUser() {
    if (this.userToDeleteId !== undefined) {
      this.userService.deleteUser(this.userToDeleteId).subscribe(
        () => {
          this.loadUsers();
          this.closeConfirmationModal();
          this.triggerSuccessDelete();
        },
        (error) => {
          console.error('Error deleting user:', error);
        }
      );
    }
  }

  closeConfirmationModal() {
    this.userToDeleteId = undefined;
    this.ngxSmartModalService.getModal('confirmationModal').close();
  }

  triggerSuccessCreate() {
    this.toastService.showSuccess(this.successTpl);
  }

  triggerSuccessEdit() {
    this.toastService.showSuccess(this.editTpl);
  }

  triggerSuccessDelete() {
    this.toastService.showSuccess(this.deleteTpl);
  }

  triggerEmptyToast() {
    this.toastService.showDanger(this.dangerTpl);
  }

  closeModal() {
    this.ngUser = { UserName: '', UserEmail: '', RoleID: null }; // Reset user data
    this.ngxSmartModalService.close('myModal');
    this.editMode = false;
  }
}
