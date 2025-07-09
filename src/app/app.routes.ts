import { Routes } from '@angular/router';
import { LoginComponent } from './pages/admin/login/login.component';
import { SignupComponent } from './pages/admin/signup/signup.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { ConfessionsComponent as AdminConfessionsComponent } from './pages/admin/confessions/confessions.component';
import { ConfessionsComponent } from './pages/confessions/confessions.component';

export const routes: Routes = [
  { path: 'confessions', component: ConfessionsComponent },
  { path: 'admin/login', component: LoginComponent },
  { path: 'admin/signup', component: SignupComponent },
  { 
    path: 'admin', 
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', loadComponent: () => import('./pages/admin/overview/overview.component').then(m => m.OverviewComponent) },
      { path: 'confessions', component: AdminConfessionsComponent },
      // { path: 'episodes', loadComponent: () => import('./pages/admin/episodes/episodes.component').then(m => m.EpisodesComponent) },
      // { path: 'users', loadComponent: () => import('./pages/admin/users/users.component').then(m => m.UsersComponent) }
    ]
  }
];
