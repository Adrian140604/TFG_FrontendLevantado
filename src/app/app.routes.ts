import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Register } from './shared/register/register';
import { Login } from './shared/login/login';
import { Books } from './features/books/books';
import { authGuardGuard } from './core/guards/auth-guard-guard';
import { ForgotPassowrd } from './shared/forgot-password/forgot-passowrd';
import { ResetPassword } from './shared/reset-password/reset-password';
import { AddBook } from './shared/add-book/add-book';
import { adminGuardGuard } from './core/guards/admin-guard-guard';
import { MyLoans } from './shared/my-loans/my-loans';

export const routes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'libros', component: Books, canActivate: [authGuardGuard] },
  { path: 'add-book', component: AddBook, canActivate: [authGuardGuard,adminGuardGuard] },
  { path: 'forgot-password', component: ForgotPassowrd },
  { path: 'reset-password', component: ResetPassword },
  { path: 'mis-prestamos', component: MyLoans, canActivate: [authGuardGuard] },

];
