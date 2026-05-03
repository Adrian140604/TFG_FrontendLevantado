import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BookService } from '../../core/services/book-service';
import { CreateBookRequest } from '../../../interfaces/types';

@Component({
  selector: 'app-add-book',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './add-book.html',
  styleUrl: './add-book.css',
})
export class AddBook {
  private fb = inject(FormBuilder);
  private bookService = inject(BookService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  addBookForm = this.fb.group({
    isbn: ['', [Validators.required, Validators.maxLength(20)]],
    title: ['', [Validators.required, Validators.maxLength(200)]],
    publisher: ['', [Validators.maxLength(150)]],
    publicationYear: [null as number | null, [Validators.required, Validators.min(1000), Validators.max(2100)]],
    category: ['', [Validators.required, Validators.maxLength(100)]],
    authors: ['', [Validators.required]],
    copies: [1, [Validators.required, Validators.min(1)]]
  });

  submit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.addBookForm.invalid) {
      this.addBookForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const authorsText = this.addBookForm.value.authors ?? '';

    const bookRequest: CreateBookRequest = {
      isbn: this.addBookForm.value.isbn ?? '',
      title: this.addBookForm.value.title ?? '',
      publisher: this.addBookForm.value.publisher ?? '',
      publicationYear: this.addBookForm.value.publicationYear ?? 0,
      category: this.addBookForm.value.category ?? '',
      authors: authorsText
        .split(',')
        .map(author => author.trim())
        .filter(author => author.length > 0),
      copies: this.addBookForm.value.copies ?? 1
    };

    this.bookService.createBook(bookRequest).subscribe({
      next: () => {
        this.successMessage = 'Libro añadido correctamente.';
        this.isSubmitting = false;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/libros']);
        }, 1000);
      },
      error: (errorResponse) => {
        this.errorMessage = errorResponse.error?.error || 'Ha ocurrido un error al añadir el libro.';
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  hasError(fieldName: string, errorName: string): boolean {
    const field = this.addBookForm.get(fieldName);
    return !!field && field.hasError(errorName) && (field.dirty || field.touched);
  }
}
