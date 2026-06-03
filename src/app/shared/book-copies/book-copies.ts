import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BookCopyService } from '../../core/services/book-copy-service';
import { BookCopy } from '../../../interfaces/types';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-book-copies',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './book-copies.html',
  styleUrl: './book-copies.css',
})
export class BookCopies {
   private bookCopyService = inject(BookCopyService);
  private cdr = inject(ChangeDetectorRef);

  copies: BookCopy[] = [];
  filteredCopies: BookCopy[] = [];

  searchText = '';
  errorMessage = '';
  successMessage = '';
  isLoading = true;

  editingCopyId: number | null = null;
  editingStatus = '';
  editingStatusNote = '';

  constructor() {
    this.loadCopies();
  }

  loadCopies(): void {
    this.bookCopyService.getAllCopies().subscribe({
      next: (copies: BookCopy[]) => {
        this.copies = copies;
        this.filteredCopies = copies;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (errorResponse: HttpErrorResponse) => {
        this.errorMessage = errorResponse.error?.error || 'No se han podido cargar los ejemplares.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  searchCopies(): void {
    const text = this.searchText.toLowerCase().trim();

    if (!text) {
      this.filteredCopies = this.copies;
      return;
    }

    this.filteredCopies = this.copies.filter(copy =>
      copy.bookTitle.toLowerCase().includes(text) ||
      copy.status.toLowerCase().includes(text) ||
      copy.copyId.toString().includes(text)
    );
  }

  startEdit(copy: BookCopy): void {
    this.editingCopyId = copy.copyId;
    this.editingStatus = copy.status;
    this.editingStatusNote = copy.statusNote ?? '';
    this.errorMessage = '';
    this.successMessage = '';
  }

  cancelEdit(): void {
    this.editingCopyId = null;
    this.editingStatus = '';
    this.editingStatusNote = '';
  }

  updateCopyStatus(): void {
    if (!this.editingCopyId) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.bookCopyService.updateStatus(this.editingCopyId, {
      status: this.editingStatus,
      statusNote: this.editingStatusNote
    }).subscribe({
      next: (updatedCopy: BookCopy) => {
        this.copies = this.copies.map(copy =>
          copy.copyId === updatedCopy.copyId ? updatedCopy : copy
        );

        this.filteredCopies = this.filteredCopies.map(copy =>
          copy.copyId === updatedCopy.copyId ? updatedCopy : copy
        );

        this.successMessage = 'Estado del ejemplar actualizado correctamente.';
        this.cancelEdit();
        this.cdr.detectChanges();
      },
      error: (errorResponse: HttpErrorResponse) => {
        this.errorMessage = errorResponse.error?.error || 'No se ha podido actualizar el estado del ejemplar.';
        this.cdr.detectChanges();
      }
    });
  }

  getStatusClass(status: string): string {
    if (status === 'DISPONIBLE') {
      return 'badge bg-success';
    }

    if (status === 'PRESTADO') {
      return 'badge bg-primary';
    }

    if (status === 'DAÑADO') {
      return 'badge bg-warning text-dark';
    }

    if (status === 'EXTRAVIADO') {
      return 'badge bg-danger';
    }

    return 'badge bg-secondary';
  }
}
