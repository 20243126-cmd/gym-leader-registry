
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    title: 'Home | Gym Leader Registry',
    loadComponent: () =>
      import('./pages/home/home').then(m => m.Home)
  },
  {
    path: 'leaders',
    title: 'Gym Leaders | Gym Leader Registry',
    loadComponent: () =>
      import('./pages/leaders/leaders').then(m => m.Leaders)
  },
  {
    path: 'leaders/new',
    title: 'Add Gym Leader | Gym Leader Registry',
    loadComponent: () =>
      import('./pages/leader-form/leader-form').then(m => m.LeaderForm)
  },
  {
    path: 'leaders/:id/edit',
    title: 'Edit Gym Leader | Gym Leader Registry',
    loadComponent: () =>
      import('./pages/leader-form/leader-form').then(m => m.LeaderForm)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
