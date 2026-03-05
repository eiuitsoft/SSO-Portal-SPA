import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'sso-callback', pathMatch: 'full' },
  {
    path: '',
    loadChildren: () => import('./pages/pages.module').then((m) => m.PagesModule),
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: 'sso-callback', pathMatch: 'full' },
];
