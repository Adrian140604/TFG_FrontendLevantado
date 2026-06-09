import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReminderResponse } from '../../../interfaces/types';

@Injectable({
  providedIn: 'root',
})
export class ReminderService {
  private http = inject(HttpClient);
  private apiUrl = 'https://proyecto2526backend-adrian140604-2.onrender.com/api/reminders';

  sendDueLoanReminders(): Observable<ReminderResponse> {
    return this.http.post<ReminderResponse>(`${this.apiUrl}/due-loans`, {});
  }
}
