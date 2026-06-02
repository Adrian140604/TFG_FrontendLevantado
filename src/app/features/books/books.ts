import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { BookService } from '../../core/services/book-service';
import { Book, User } from '../../../interfaces/types';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { LoanService } from '../../core/services/loan-service';
import { UserService } from '../../core/services/user-service';
import { ReservationService } from '../../core/services/reservation-service';

@Component({
  selector: 'app-books',
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './books.html',
  styleUrl: './books.css',
})
export class Books {
  private bookService = inject(BookService);
  private loanService = inject(LoanService);
  private userService = inject(UserService);
  private reservationService = inject(ReservationService);
  private cdr = inject(ChangeDetectorRef);
  authService = inject(AuthService);
  

  books: Book[] = [];
  filteredBooks: Book[] = [];
  users: User[] = [];

  searchText = '';
  errorMessage = '';
  successMessage = '';
  isLoading = true;

  loanUserIds: { [bookId: number]: number | null } = {};

  constructor() {
    this.loadBooks();
    this.loadUsers();
  }

  loadBooks(): void {
    
    this.bookService.getBooks().subscribe({
    next: (books: Book[]) => {
      this.books = books;
      this.filteredBooks = books;

      this.books.forEach(book => {
        if (this.loanUserIds[book.bookId] === undefined) {
          this.loanUserIds[book.bookId] = null;
        }
      });

      this.isLoading = false;
      this.cdr.detectChanges();
    },
      error: () => {
        this.errorMessage = 'No se han podido cargar los libros.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadUsers(): void {
    if (!this.authService.canCreateLoans()) {
      return;
    }

    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        this.users = users.filter(user => user.role === 'USER');
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'No se han podido cargar los usuarios.';
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
  reserveBook(bookId: number): void {
  this.errorMessage = '';
  this.successMessage = '';

  this.reservationService.createReservation(bookId).subscribe({
    next: () => {
      this.successMessage = 'Reserva realizada correctamente. Recuerda recoger el libro antes de 24 horas.';
      this.loadBooks();
      this.cdr.detectChanges();
    },
    error: (errorResponse) => {
      this.errorMessage = errorResponse.error?.error || 'No se ha podido realizar la reserva.';
      this.cdr.detectChanges();
    }
  });
}

  createLoan(bookId: number): void {
  this.errorMessage = '';
  this.successMessage = '';

  const userId = this.loanUserIds[bookId];

  if (!userId) {
    this.errorMessage = 'Debes seleccionar un usuario.';
    return;
  }

  this.loanService.createLoan(bookId, userId).subscribe({
    next: () => {
      this.successMessage = 'Préstamo realizado correctamente.';

      this.loanUserIds[bookId] = null;

      this.books = this.books.map(book => {
        if (book.bookId === bookId) {
          return {
            ...book,
            availableCopies: book.availableCopies - 1,
            loanedCopies: book.loanedCopies + 1
          };
        }

        return book;
      });

      this.filteredBooks = this.filteredBooks.map(book => {
        if (book.bookId === bookId) {
          return {
            ...book,
            availableCopies: book.availableCopies - 1,
            loanedCopies: book.loanedCopies + 1
          };
        }

        return book;
      });

      this.cdr.detectChanges();
    },
    error: (errorResponse) => {
      this.errorMessage = errorResponse.error?.error || 'No se ha podido realizar el préstamo.';
      this.cdr.detectChanges();
    }
  });
}
}
