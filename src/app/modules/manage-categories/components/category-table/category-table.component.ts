import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { CategoryService } from 'src/app/core/APIservices/categories.service';
import { ToastService } from 'src/app/shared/components/toast/toast.service';

@Component({
  selector: 'app-category-table',
  templateUrl: './category-table.component.html',
  styleUrls: ['./category-table.component.css'],
})
export class CategoryTableComponent implements OnInit {
  @ViewChild('myForm') form!: NgForm;
  @ViewChild('successTpl') successTpl!: TemplateRef<any>;
  @ViewChild('editTpl') editTpl!: TemplateRef<any>;
  @ViewChild('deleteTpl') deleteTpl!: TemplateRef<any>;
  @ViewChild('dangerTpl') dangerTpl!: TemplateRef<any>;

  categoryToDeleteId: number | undefined;
  data: any[] = [];
  editMode = false;
  editIndex: any;
  ngCat = '';
  isLoading = false;

  constructor(
    public ngxSmartModalService: NgxSmartModalService,
    private categoryService: CategoryService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading = true; // Set isLoading to true when loading starts
    this.categoryService.getCategories().subscribe(
      (data: any[]) => {
        this.data = data.map((category) => ({
          id: category.categoryID, // Include category ID
          category: category.categoryName,
        }));
        this.isLoading = false; // Set isLoading to false when loading is complete
      },
      (error) => {
        console.error('Error fetching categories:', error);
        this.isLoading = false; // Set isLoading to false in case of error
      }
    );
  }

  addCat(form: NgForm) {
    if (form.invalid) {
      this.triggerEmptyToast();
      return;
    }
    const categoryData: { categoryName: string; categoryID?: number } = {
      categoryName: this.ngCat,
    };
    if (this.editMode) {
      const categoryId = this.data[this.editIndex].id;
      // Include categoryId in categoryData
      categoryData.categoryID = categoryId;
      this.categoryService.updateCategory(categoryId, categoryData).subscribe(
        () => {
          this.loadCategories(); // Reload categories after updating
          this.closeModal();
          this.triggerSuccessEdit();
        },
        (error) => {
          console.error('Error updating category:', error);
        }
      );
    } else {
      this.categoryService.createCategory(categoryData).subscribe(
        () => {
          this.loadCategories();
          this.closeModal();
          this.triggerSuccessCreate();
        },
        (error) => {
          console.error('Error adding category:', error);
        }
      );
    }
    this.editMode = false;
  }

  onDel(categoryId: number) {
    this.categoryService.deleteCategory(categoryId).subscribe(
      () => {
        this.loadCategories();
        this.triggerSuccessDelete();
      },
      (error) => {
        console.error('Error deleting category:', error);
      }
    );
  }

  onEdit(categoryId: number) {
    const index = this.data.findIndex((category) => category.id === categoryId);

    if (index !== -1) {
      this.editMode = true;

      this.editIndex = index;

      this.ngxSmartModalService.open('myModal');

      this.form.setValue({
        category: this.data[this.editIndex].category,
      });
    } else {
      console.error(`Category with ID ${categoryId} not found.`);
    }
  }

  openConfirmationModal(categoryId: number) {
    this.ngxSmartModalService.getModal('confirmationModal').open();
    // Store the category ID in a property to use it when confirming deletion
    this.categoryToDeleteId = categoryId;
  }

  deleteCategory() {
    if (this.categoryToDeleteId !== undefined) {
      console.log('Deleting category with ID:', this.categoryToDeleteId); // Add this line
      this.categoryService.deleteCategory(this.categoryToDeleteId).subscribe(
        () => {
          this.loadCategories();
          this.closeConfirmationModal();
          this.triggerSuccessDelete();
        },
        (error) => {
          console.error('Error deleting category:', error);
          // Optionally, display an error message to the user
        }
      );
    }
  }

  closeConfirmationModal() {
    // Reset the categoryToDeleteId property and close the confirmation modal
    this.categoryToDeleteId = undefined;
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
    this.ngCat = '';
    this.ngxSmartModalService.close('myModal');
    this.editMode = false;
  }
}
