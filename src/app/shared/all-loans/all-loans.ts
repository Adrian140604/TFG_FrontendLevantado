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
  successMessage = '';
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

  returnLoan(loanId: number): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.loanService.returnLoan(loanId).subscribe({
      next: (updatedLoan: Loan) => {
        this.successMessage = 'Devolución registrada correctamente.';

        this.loans = this.loans.map(loan =>
          loan.loanId === updatedLoan.loanId ? updatedLoan : loan
        );

        this.cdr.detectChanges();
      },
      error: (errorResponse) => {
        this.errorMessage = errorResponse.error?.error || 'No se ha podido registrar la devolución.';
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
