import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';

@Component({
  selector: 'app-librarians',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './librarians.html',
  styleUrl: './librarians.css',
})
export class Librarians {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  librarianForm = this.fb.group({
    name: ['', [Validators.required]],
    institutionalEmail: ['', [Validators.required, Validators.email]],
    department: [{ value: 'Biblioteca', disabled: true }, [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    repeatPassword: ['', [Validators.required]]
  });

  submit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.librarianForm.invalid) {
      this.librarianForm.markAllAsTouched();
      return;
    }

    const password = this.librarianForm.value.password ?? '';
    const repeatPassword = this.librarianForm.value.repeatPassword ?? '';

    if (password !== repeatPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    this.isSubmitting = true;

    const request = {
      name: this.librarianForm.value.name ?? '',
      institutionalEmail: (this.librarianForm.value.institutionalEmail ?? '').trim().toLowerCase(),
      department: this.librarianForm.getRawValue().department ?? 'Biblioteca',
      password,
      repeatPassword
    };

    this.authService.createLibrarian(request).subscribe({
      next: () => {
        this.successMessage = 'Bibliotecario creado correctamente.';
        this.librarianForm.reset();
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
      error: (errorResponse: HttpErrorResponse) => {
        this.errorMessage = errorResponse.error?.error || 'No se ha podido crear el bibliotecario.';
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  hasError(fieldName: string, errorName: string): boolean {
    const field = this.librarianForm.get(fieldName);
    return !!field && field.hasError(errorName) && (field.dirty || field.touched);
  }
}
