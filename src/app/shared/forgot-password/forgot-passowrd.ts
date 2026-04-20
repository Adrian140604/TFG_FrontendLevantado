import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth-service';
import { ApiError } from '../../../interfaces/types';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-passowrd',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-passowrd.html',
  styleUrl: './forgot-passowrd.css',
})
export class ForgotPassowrd {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  forgotPasswordForm = this.fb.group({
    institutionalEmail: ['', [Validators.required, Validators.email]]
  });

  submit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const email = this.forgotPasswordForm.value.institutionalEmail ?? '';

    this.authService.forgotPassword(email).subscribe({
      next: (response: string) => {
        this.successMessage = response || 'Se ha enviado un email para restablecer la contraseña.';
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
      error: (errorResponse) => {
        const apiError = errorResponse.error as ApiError;
        this.errorMessage = apiError?.error || 'Ha ocurrido un error inesperado.';
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  hasError(fieldName: string, errorName: string): boolean {
    const field = this.forgotPasswordForm.get(fieldName);
    return !!field && field.hasError(errorName) && (field.dirty || field.touched);
  }
}
