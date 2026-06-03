import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookCopy, UpdateBookCopyStatusRequest } from '../../../interfaces/types';

@Injectable({
  providedIn: 'root',
})
export class BookCopyService {
  private http = inject(HttpClient);
  private apiUrl = 'https://proyecto2526backend-adrian140604-2.onrender.com/api/book-copies';

  getAllCopies(): Observable<BookCopy[]> {
    return this.http.get<BookCopy[]>(this.apiUrl);
  }

  getCopiesByBook(bookId: number): Observable<BookCopy[]> {
    return this.http.get<BookCopy[]>(`${this.apiUrl}/books/${bookId}`);
  }

  updateStatus(copyId: number, request: UpdateBookCopyStatusRequest): Observable<BookCopy> {
    return this.http.put<BookCopy>(`${this.apiUrl}/${copyId}/status`, request);
  }
}
