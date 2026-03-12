import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./shared/layout/layout').then(m => m.LayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard').then(m => m.DashboardComponent)
      },
      {
        path: 'servers',
        loadComponent: () =>
          import('./pages/servers/servers').then(m => m.ServersComponent)
      },
      {
        path: 'deployments',
        loadComponent: () =>
          import('./pages/deployments/deployments').then(m => m.DeploymentsComponent)
      },
      {
        path: 'logs',
        loadComponent: () =>
          import('./pages/logs/logs').then(m => m.LogsComponent)
      },
      {
        path: 'alerts',
        loadComponent: () =>
          import('./pages/alerts/alerts').then(m => m.AlertsComponent)
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/users/users').then(m => m.UsersComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];