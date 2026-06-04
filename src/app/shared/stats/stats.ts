import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { StatsService } from '../../core/services/stats-service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Stats as StatsModel } from '../../../interfaces/types';


@Component({
  selector: 'app-stats',
  imports: [CommonModule, RouterLink],
  templateUrl: './stats.html',
  styleUrl: './stats.css',
})
export class Stats {
  private statsService = inject(StatsService);
  private cdr = inject(ChangeDetectorRef);

  stats: StatsModel | null = null;
  errorMessage = '';
  isLoading = true;

  constructor() {
    this.loadStats();
  }

  loadStats(): void {
    this.statsService.getStats().subscribe({
      next: (stats: StatsModel) => {
        this.stats = stats;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (errorResponse: HttpErrorResponse) => {
        this.errorMessage = errorResponse.error?.error || 'No se han podido cargar las estadísticas.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
