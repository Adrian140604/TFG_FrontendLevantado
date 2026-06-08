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
import { AllLoans } from './shared/all-loans/all-loans';
import { MySanctions } from './shared/my-sanctions/my-sanctions';
import { AllSanctions } from './shared/all-sanctions/all-sanctions';
import { SanctionConfigComponent } from './shared/sanction-config/sanction-configComponent';
import { MyReservations } from './shared/my-reservations/my-reservations';
import { AllReservations } from './shared/all-reservations/all-reservations';
import { Categories } from './shared/categories/categories';
import { BookCopies } from './shared/book-copies/book-copies';
import { Librarians } from './shared/librarians/librarians';
import { Users } from './shared/users/users';
import { Stats } from './shared/stats/stats';
import { Profile } from './shared/profile/profile';


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
  { path: 'prestamos', component: AllLoans, canActivate: [authGuardGuard] },
  { path: 'mis-sanciones', component: MySanctions, canActivate: [authGuardGuard] },
  { path: 'sanciones', component: AllSanctions, canActivate: [authGuardGuard] },
  { path: 'configuracion-sanciones', component: SanctionConfigComponent, canActivate: [authGuardGuard] },
  { path: 'mis-reservas', component: MyReservations, canActivate: [authGuardGuard] },
  { path: 'reservas', component: AllReservations, canActivate: [authGuardGuard] },
  { path: 'categorias', component: Categories, canActivate: [authGuardGuard] },
  { path: 'ejemplares', component: BookCopies, canActivate: [authGuardGuard] },
  { path: 'bibliotecarios', component: Librarians, canActivate: [authGuardGuard] },
  { path: 'usuarios', component: Users, canActivate: [authGuardGuard] },
  { path: 'estadisticas', component: Stats, canActivate: [authGuardGuard] },
  { path: 'perfil', component: Profile, canActivate: [authGuardGuard] },


];
