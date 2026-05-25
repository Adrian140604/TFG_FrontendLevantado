import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { SanctionService } from '../../core/services/sanction-service';
import { Sanction } from '../../../interfaces/types';

@Component({
  selector: 'app-my-sanctions',
  imports: [],
  templateUrl: './my-sanctions.html',
  styleUrl: './my-sanctions.css',
})
export class MySanctions {
  private sanctionService = inject(SanctionService);
  private cdr = inject(ChangeDetectorRef);

  sanctions: Sanction[] = [];
  errorMessage = '';
  isLoading = true;

  constructor() {
    this.loadMySanctions();
  }

  loadMySanctions(): void {
    this.sanctionService.getMySanctions().subscribe({
      next: (sanctions: Sanction[]) => {
        this.sanctions = sanctions;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (errorResponse) => {
        this.errorMessage = errorResponse.error?.error || 'No se han podido cargar tus sanciones.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getStatusClass(active: boolean): string {
    return active ? 'badge bg-danger' : 'badge bg-success';
  }

  getStatusText(active: boolean): string {
    return active ? 'ACTIVA' : 'FINALIZADA';
  }
}
