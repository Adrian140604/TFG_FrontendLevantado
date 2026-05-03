import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { BookService } from '../../core/services/book-service';
import { Book } from '../../../interfaces/types';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-books',
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './books.html',
  styleUrl: './books.css',
})
export class Books {
  private bookService = inject(BookService);
  private cdr = inject(ChangeDetectorRef);

  books: Book[] = [];
  filteredBooks: Book[] = [];

  searchText = '';
  errorMessage = '';
  isLoading = true;

  constructor() {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (books: Book[]) => {
        this.books = books;
        this.filteredBooks = books;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'No se han podido cargar los libros';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  searchBooks(): void {
    const text = this.searchText.toLowerCase().trim();

    if (!text) {
      this.filteredBooks = this.books;
      return;
    }

    this.filteredBooks = this.books.filter(book =>
      (book.title ?? '').toLowerCase().includes(text) ||
      (book.isbn ?? '').toLowerCase().includes(text) ||
      (book.publisher ?? '').toLowerCase().includes(text) ||
      (book.category ?? '').toLowerCase().includes(text) ||
      (book.publicationYear ?? '').toString().includes(text) ||
      (book.authors ?? []).some(author => author.toLowerCase().includes(text))
    );
  }
}
