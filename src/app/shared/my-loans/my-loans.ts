import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { LoanService } from '../../core/services/loan-service';
import { Loan } from '../../../interfaces/types';

@Component({
  selector: 'app-my-loans',
  imports: [],
  templateUrl: './my-loans.html',
  styleUrl: './my-loans.css',
})
export class MyLoans {
  private loanService = inject(LoanService);
  private cdr = inject(ChangeDetectorRef);

  loans: Loan[] = [];
  errorMessage = '';
  isLoading = true;

  constructor() {
    this.loadMyLoans();
  }

  loadMyLoans(): void {
    this.loanService.getMyLoans().subscribe({
      next: (loans: Loan[]) => {
        this.loans = loans;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (errorResponse) => {
        this.errorMessage = errorResponse.error?.error || 'No se han podido cargar tus préstamos.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getStatusClass(status: string): string {
    if (status === 'ACTIVO') {
      return 'badge bg-primary';
    }

    if (status === 'DEVUELTO') {
      return 'badge bg-success';
    }

    if (status === 'RETRASADO') {
      return 'badge bg-danger';
    }

    return 'badge bg-secondary';
  }
}
