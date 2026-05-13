import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Loan } from '../../../interfaces/types';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  private http = inject(HttpClient);
  private apiUrl = 'https://proyecto2526backend-adrian140604-2.onrender.com/api/loans';

  createLoan(bookId: number, userId: number): Observable<Loan> {
    return this.http.post<Loan>(`${this.apiUrl}/books/${bookId}/users/${userId}`, {});
  }
}
