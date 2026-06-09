import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AuditLogService } from '../../core/services/audit-log-service';
import { AuditLog } from '../../../interfaces/types';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-audit-logs',
  imports: [CommonModule, RouterLink],
  templateUrl: './audit-logs.html',
  styleUrl: './audit-logs.css',
})
export class AuditLogs {
  private auditLogService = inject(AuditLogService);
  private cdr = inject(ChangeDetectorRef);

  auditLogs: AuditLog[] = [];

  errorMessage = '';
  isLoading = true;

  constructor() {
    this.loadAuditLogs();
  }

  loadAuditLogs(): void {
    this.auditLogService.getAuditLogs().subscribe({
      next: (auditLogs: AuditLog[]) => {
        this.auditLogs = auditLogs;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (errorResponse: HttpErrorResponse) => {
        this.errorMessage = errorResponse.error?.error || 'No se ha podido cargar la auditoría.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getActionClass(action: string): string {
    if (action === 'CREAR_LIBRO') {
      return 'badge bg-success';
    }

    if (action === 'CAMBIAR_ESTADO_EJEMPLAR') {
      return 'badge bg-warning text-dark';
    }

    return 'badge bg-secondary';
  }
}
