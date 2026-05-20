import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { LoanService } from '../../core/services/loan-service';
import { Loan } from '../../../interfaces/types';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-all-loans',
  imports: [RouterLink],
  templateUrl: './all-loans.html',
  styleUrl: './all-loans.css',
})
export class AllLoans {
  private loanService = inject(LoanService);
  private cdr = inject(ChangeDetectorRef);

  loans: Loan[] = [];
  errorMessage = '';
  isLoading = true;

  constructor() {
    this.loadLoans();
  }

  loadLoans(): void {
    this.loanService.getAllLoans().subscribe({
      next: (loans: Loan[]) => {
        this.loans = loans;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (errorResponse) => {
        this.errorMessage = errorResponse.error?.error || 'No se han podido cargar los préstamos.';
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
