import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ReminderService } from '../../core/services/reminder-service';
import { ReminderResponse } from '../../../interfaces/types';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reminders',
  imports: [CommonModule, RouterLink],
  templateUrl: './reminders.html',
  styleUrl: './reminders.css',
})
export class Reminders {
   private reminderService = inject(ReminderService);
  private cdr = inject(ChangeDetectorRef);

  errorMessage = '';
  successMessage = '';
  isSubmitting = false;
  remindersSent: number | null = null;

  sendReminders(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.remindersSent = null;

    const confirmed = confirm('¿Seguro que quieres enviar los recordatorios de préstamos que vencen mañana?');

    if (!confirmed) {
      return;
    }

    this.isSubmitting = true;

    this.reminderService.sendDueLoanReminders().subscribe({
      next: (response: ReminderResponse) => {
        this.remindersSent = response.remindersSent;
        this.successMessage = response.message;
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
      error: (errorResponse: HttpErrorResponse) => {
        this.errorMessage = errorResponse.error?.error || 'No se han podido enviar los recordatorios.';
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }
}
