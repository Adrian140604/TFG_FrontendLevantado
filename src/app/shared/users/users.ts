import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { UserService } from '../../core/services/user-service';
import { User } from '../../../interfaces/types';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-users',
  imports: [],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
   private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);

  users: User[] = [];
  errorMessage = '';
  successMessage = '';
  isLoading = true;

  constructor() {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        this.users = users;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (errorResponse: HttpErrorResponse) => {
        this.errorMessage = errorResponse.error?.error || 'No se han podido cargar los usuarios.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  disableUser(userId: number): void {
    this.errorMessage = '';
    this.successMessage = '';

    const confirmed = confirm('¿Seguro que quieres dar de baja a este usuario?');

    if (!confirmed) {
      return;
    }

    this.userService.disableUser(userId).subscribe({
      next: (response: string) => {
        this.successMessage = response || 'Usuario dado de baja correctamente.';

        this.users = this.users.filter(user => user.userId !== userId);

        this.cdr.detectChanges();
      },
      error: (errorResponse: HttpErrorResponse) => {
        this.errorMessage = errorResponse.error?.error || 'No se ha podido dar de baja el usuario.';
        this.cdr.detectChanges();
      }
    });
  }
}
