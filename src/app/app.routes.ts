import { Routes } from '@angular/router';
import { LoginComponent } from './pages/admin/login/login.component';
import { SignupComponent } from './pages/admin/signup/signup.component';

export const routes: Routes = [
  { path: 'admin/login', component: LoginComponent },
  { path: 'admin/signup', component: SignupComponent }
];
