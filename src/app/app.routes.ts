import { Routes } from '@angular/router';

import { EpisodesListComponent } from './episodes-list/episodes-list.component';
import { EpisodeDetailsComponent } from './episode-details/episode-details.component';
import { LoginComponent } from './pages/admin/login/login.component';
import { SignupComponent } from './pages/admin/signup/signup.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { ConfessionsComponent as AdminConfessionsComponent } from './pages/admin/confessions/confessions.component';
import { ConfessionsComponent } from './pages/confessions/confessions.component';
import { TeamManagementComponent } from './pages/admin/team/team-management/team-management.component';
import { HomeComponent } from './pages/home/home.component';
import { TeamComponent } from './pages/team/team.component';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'team', loadComponent: () => import('./pages/team/team.component').then(m => m.TeamComponent) },
    { path: 'episodes', component: EpisodesListComponent },
  { path: 'episodes/:id', component: EpisodeDetailsComponent },
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
      { path: 'teams', loadComponent: () => import('./pages/admin/team/team-management/team-management.component').then(m => m.TeamManagementComponent) }
    ]
  }
];
