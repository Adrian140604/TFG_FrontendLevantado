import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { SanctionService } from '../../core/services/sanction-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SanctionConfig } from '../../../interfaces/types';

@Component({
  selector: 'app-sanction-config',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './sanction-config.html',
  styleUrl: './sanction-config.css',
})
export class SanctionConfigComponent {
  private sanctionService = inject(SanctionService);
  private cdr = inject(ChangeDetectorRef);

  config: SanctionConfig | null = null;
  sanctionDaysPerDelayDay: number | null = null;

  errorMessage = '';
  successMessage = '';
  isLoading = true;
  isSubmitting = false;

  constructor() {
    this.loadConfig();
  }

  loadConfig(): void {
    this.sanctionService.getConfig().subscribe({
      next: (config: SanctionConfig) => {
        this.config = config;
        this.sanctionDaysPerDelayDay = config.sanctionDaysPerDelayDay;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (errorResponse) => {
        this.errorMessage = errorResponse.error?.error || 'No se ha podido cargar la configuración.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  saveConfig(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.sanctionDaysPerDelayDay || this.sanctionDaysPerDelayDay < 1) {
      this.errorMessage = 'Debes indicar al menos 1 día de sanción por cada día de retraso.';
      return;
    }

    this.isSubmitting = true;

    this.sanctionService.updateConfig({
      sanctionDaysPerDelayDay: this.sanctionDaysPerDelayDay
    }).subscribe({
      next: (config: SanctionConfig) => {
        this.config = config;
        this.sanctionDaysPerDelayDay = config.sanctionDaysPerDelayDay;
        this.successMessage = 'Configuración de sanciones actualizada correctamente.';
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
      error: (errorResponse) => {
        this.errorMessage = errorResponse.error?.error || 'No se ha podido actualizar la configuración.';
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }
}
