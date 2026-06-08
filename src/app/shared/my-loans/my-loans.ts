import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { LoanService } from '../../core/services/loan-service';
import { Loan } from '../../../interfaces/types';
import { RouterLink } from "@angular/router";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-my-loans',
  imports: [RouterLink],
  templateUrl: './my-loans.html',
  styleUrl: './my-loans.css',
})
export class MyLoans {
  private loanService = inject(LoanService);
  private cdr = inject(ChangeDetectorRef);

  loans: Loan[] = [];
  errorMessage = '';
  isLoading = true;
  successMessage = '';

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

  extendLoan(loanId: number): void {
  this.errorMessage = '';
  this.successMessage = '';

  const confirmed = confirm('¿Seguro que quieres solicitar una prórroga de este préstamo?');

  if (!confirmed) {
    return;
  }

  this.loanService.extendLoan(loanId).subscribe({
    next: (updatedLoan: Loan) => {
      this.loans = this.loans.map(loan =>
        loan.loanId === updatedLoan.loanId ? updatedLoan : loan
      );

      this.successMessage = 'Prórroga solicitada correctamente. La fecha de devolución se ha ampliado 7 días.';
      this.cdr.detectChanges();
    },
    error: (errorResponse: HttpErrorResponse) => {
      this.errorMessage = errorResponse.error?.error || 'No se ha podido solicitar la prórroga.';
      this.cdr.detectChanges();
    }
  });
}
}
