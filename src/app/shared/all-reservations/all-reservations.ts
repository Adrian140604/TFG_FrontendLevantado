import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ReservationService } from '../../core/services/reservation-service';
import { Reservation } from '../../../interfaces/types';

@Component({
  selector: 'app-all-reservations',
  imports: [],
  templateUrl: './all-reservations.html',
  styleUrl: './all-reservations.css',
})
export class AllReservations {
  private reservationService = inject(ReservationService);
  private cdr = inject(ChangeDetectorRef);

  reservations: Reservation[] = [];
  errorMessage = '';
  isLoading = true;

  constructor() {
    this.loadReservations();
  }

  loadReservations(): void {
    this.reservationService.getAllReservations().subscribe({
      next: (reservations: Reservation[]) => {
        this.reservations = reservations;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (errorResponse) => {
        this.errorMessage = errorResponse.error?.error || 'No se han podido cargar las reservas.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getStatusClass(status: string): string {
    if (status === 'ACTIVA') {
      return 'badge bg-primary';
    }

    if (status === 'EXPIRADA') {
      return 'badge bg-warning text-dark';
    }

    if (status === 'CANCELADA') {
      return 'badge bg-secondary';
    }

    if (status === 'RECOGIDA') {
      return 'badge bg-success';
    }

    return 'badge bg-secondary';
  }
}
