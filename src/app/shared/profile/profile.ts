import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { UserService } from '../../core/services/user-service';
import { User } from '../../../interfaces/types';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);

  user: User | null = null;

  name = '';
  course = '';
  department = '';
  institutionalEmail = '';

  errorMessage = '';
  successMessage = '';
  isLoading = true;
  isSubmitting = false;

  constructor() {
    this.loadProfile();
  }

  loadProfile(): void {
    this.userService.getMyProfile().subscribe({
      next: (user: User) => {
        this.user = user;

        this.name = user.name;
        this.institutionalEmail = user.institutionalEmail;
        this.course = user.course ?? '';
        this.department = user.department ?? '';

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (errorResponse: HttpErrorResponse) => {
        this.errorMessage = errorResponse.error?.error || 'No se ha podido cargar el perfil.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
  saveProfile(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const name = this.name.trim();
    const institutionalEmail = this.institutionalEmail.trim().toLowerCase();

    if (!name) {
      this.errorMessage = 'El nombre es obligatorio.';
      return;
    }

    if (!institutionalEmail) {
      this.errorMessage = 'El correo es obligatorio.';
      return;
    }

    this.isSubmitting = true;

    this.userService.updateMyProfile({
      name,
      institutionalEmail,
      course: this.course.trim() || null,
      department: this.department.trim() || null
    }).subscribe({
      next: (updatedUser: User) => {
        this.user = updatedUser;
        this.name = updatedUser.name;
        this.institutionalEmail = updatedUser.institutionalEmail;
        this.course = updatedUser.course ?? '';
        this.department = updatedUser.department ?? '';
        this.successMessage = 'Perfil actualizado correctamente. Si has cambiado el correo, vuelve a iniciar sesión.';
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
      error: (errorResponse: HttpErrorResponse) => {
        this.errorMessage = errorResponse.error?.error || 'No se ha podido actualizar el perfil.';
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }
}
