import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { UserService } from 'src/app/core/APIservices/user.service'; // Ensure this points to your service
import { RoleDto } from 'src/app/core/models/role.dto';
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
  roles: RoleDto[] = []; // New array for roles
  editMode = false;
  editUser: UserDto | null = null;
  ngUser: UserDto = { userName: '', userEmail: '', roleID: null, roleName: '' }; // Initialize a UserDto object
  isLoading = false;

  constructor(
    public ngxSmartModalService: NgxSmartModalService,
    private userService: UserService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers() {
    this.isLoading = true;
    this.userService.getUsers().subscribe(
      (data: UserDto[]) => {
        console.log('Fetched users:', data);
        this.data = data.map((user) => ({
          userID: user.userID || 0, // Provide a default value if UserId can be undefined
          userName: user.userName,
          userEmail: user.userEmail,
          roleID: user.roleID, // Provide a default value if RoleID can be undefined
          roleName: user.roleName || '', // Ensure roleName is handled
        }));
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching users:', error);
        this.isLoading = false;
      }
    );
  }

  loadRoles() {
    this.userService.getRoles().subscribe(
      (data: RoleDto[]) => {
        this.roles = data; // Store fetched roles
      },
      (error) => {
        console.error('Error fetching roles:', error);
      }
    );
  }

  addUser(form: NgForm) {
    if (form.invalid) {
      this.triggerEmptyToast();
      return;
    }

    if (this.editUser && this.editUser.userID) {
      // Update user logic
      this.userService.updateUser(this.editUser.userID, this.ngUser).subscribe(
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
      // Add user logic
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
    this.ngUser = { userName: '', userEmail: '', roleID: null, roleName: '' }; // Reset ngUser after save
  }

  onEdit(user: UserDto) {
    this.editMode = true;
    this.editUser = { ...user }; // Also store the user being edited
    this.ngUser = { ...user };
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
    this.ngUser = { userName: '', userEmail: '', roleID: null, roleName: '' }; // Reset user data
    this.ngxSmartModalService.close('myModal');
    this.editMode = false;
  }
}
