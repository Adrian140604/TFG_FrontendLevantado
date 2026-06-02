import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Category } from '../../../interfaces/types';
import { CategoryService } from '../../core/services/category-service';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
   private categoryService = inject(CategoryService);
  private cdr = inject(ChangeDetectorRef);

  categories: Category[] = [];

  newCategoryName = '';
  editingCategoryId: number | null = null;
  editingCategoryName = '';

  errorMessage = '';
  successMessage = '';
  isLoading = true;
  isSubmitting = false;

  constructor() {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (errorResponse:any) => {
        this.errorMessage = errorResponse.error?.error || 'No se han podido cargar las categorías.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  createCategory(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const name = this.newCategoryName.trim();

    if (!name) {
      this.errorMessage = 'El nombre de la categoría es obligatorio.';
      return;
    }

    this.isSubmitting = true;

    this.categoryService.createCategory({ name }).subscribe({
      next: (category: Category) => {
        this.categories = [...this.categories, category];
        this.newCategoryName = '';
        this.successMessage = 'Categoría creada correctamente.';
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
      error: (errorResponse:any) => {
        this.errorMessage = errorResponse.error?.error || 'No se ha podido crear la categoría.';
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  startEdit(category: Category): void {
    this.editingCategoryId = category.categoryId;
    this.editingCategoryName = category.name;
    this.errorMessage = '';
    this.successMessage = '';
  }

  cancelEdit(): void {
    this.editingCategoryId = null;
    this.editingCategoryName = '';
  }

  updateCategory(): void {
    if (!this.editingCategoryId) {
      return;
    }

    const name = this.editingCategoryName.trim();

    if (!name) {
      this.errorMessage = 'El nombre de la categoría es obligatorio.';
      return;
    }

    this.categoryService.updateCategory(this.editingCategoryId, { name }).subscribe({
      next: (updatedCategory: Category) => {
        this.categories = this.categories.map(category =>
          category.categoryId === updatedCategory.categoryId ? updatedCategory : category
        );

        this.successMessage = 'Categoría actualizada correctamente.';
        this.cancelEdit();
        this.cdr.detectChanges();
      },
      error: (errorResponse:any) => {
        this.errorMessage = errorResponse.error?.error || 'No se ha podido actualizar la categoría.';
        this.cdr.detectChanges();
      }
    });
  }

  deleteCategory(categoryId: number): void {
    this.errorMessage = '';
    this.successMessage = '';

    const confirmed = confirm('¿Seguro que quieres eliminar esta categoría?');

    if (!confirmed) {
      return;
    }

    this.categoryService.deleteCategory(categoryId).subscribe({
      next: () => {
        this.categories = this.categories.filter(category => category.categoryId !== categoryId);
        this.successMessage = 'Categoría eliminada correctamente.';
        this.cdr.detectChanges();
      },
      error: (errorResponse:any) => {
        this.errorMessage = errorResponse.error?.error || 'No se ha podido eliminar la categoría.';
        this.cdr.detectChanges();
      }
    });
  }
}
