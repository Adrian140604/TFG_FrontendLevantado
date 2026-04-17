import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, NgZone } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { ApiError, LoginRequest } from '../../../interfaces/types';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);


  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  loginForm = this.fb.group({
    institutionalEmail: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  login(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const loginData: LoginRequest = {
      institutionalEmail: this.loginForm.value.institutionalEmail ?? '',
      password: this.loginForm.value.password ?? '',
    };

    this.authService.login(loginData).subscribe({
      next: () => {
        this.successMessage = 'Inicio de sesión correcto';
        this.isSubmitting = false;
        this.router.navigate(['/']);
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
    const field = this.loginForm.get(fieldName);
    return !!field && field.hasError(errorName) && (field.dirty || field.touched);
  }
}