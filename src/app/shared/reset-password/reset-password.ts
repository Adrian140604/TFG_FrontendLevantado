import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiError } from '../../../interfaces/types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  errorMessage = '';
  successMessage = '';
  isSubmitting = false;
  token = '';

  resetPasswordForm = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(4)]],
    repeatPassword: ['', [Validators.required]]
  });

 
   ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';

    if (!this.token) {
      this.errorMessage = 'El enlace de restablecimiento no es válido.';
    }
  }

  submit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.token) {
      this.errorMessage = 'El enlace de restablecimiento no es válido.';
      return;
    }

    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    const newPassword = this.resetPasswordForm.value.newPassword ?? '';
    const repeatPassword = this.resetPasswordForm.value.repeatPassword ?? '';

    if (newPassword !== repeatPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    this.isSubmitting = true;

    this.authService.resetPassword(this.token, newPassword, repeatPassword).subscribe({
      next: (response: string) => {
        this.successMessage = response || 'Contraseña restablecida correctamente.';
        this.isSubmitting = false;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
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
    const field = this.resetPasswordForm.get(fieldName);
    return !!field && field.hasError(errorName) && (field.dirty || field.touched);
  }
}
