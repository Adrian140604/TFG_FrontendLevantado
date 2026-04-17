import { ChangeDetectorRef, Component, inject, NgZone } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    institutionalEmail: ['', [Validators.required, Validators.email, Validators.pattern('^[A-Za-z0-9._%+-]+@instituto\\.com$')]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    repeatPassword: ['', [Validators.required]],
    course: [''],
    department: ['']
  });

  register(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    
    if (!this.validateCourseOrDepartment()) {
      this.errorMessage = 'Debes seleccionar un curso o un departamento.';
      return;
    }

    this.isSubmitting = true;

    const registerData = {
      name: this.registerForm.value.name ?? '',
      institutionalEmail: this.registerForm.value.institutionalEmail ?? '',
      password: this.registerForm.value.password ?? '',
      repeatPassword: this.registerForm.value.repeatPassword ?? '',
      course: this.registerForm.value.course || null,
      department: this.registerForm.value.department || null
    };

    this.authService.register(registerData).subscribe({
      next: () => {
        this.successMessage = 'Usuario registrado correctamente.';
        this.isSubmitting = false;
        this.registerForm.reset();
      },
      error: (errorResponse) => {
        this.isSubmitting = false;
        this.errorMessage = errorResponse.error?.error || 'Ha ocurrido un error inesperado.';
        this.cdr.detectChanges(); 
      }
    });
  }
  validateCourseOrDepartment(): boolean {
    const course = this.registerForm.value.course;
    const department = this.registerForm.value.department;

    return !!(course || department); // al menos uno debe tener valor
  }

  hasError(fieldName: string, errorName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!field && field.hasError(errorName) && (field.dirty || field.touched);
  }
}
 