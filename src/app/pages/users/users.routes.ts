import { Routes } from '@angular/router';

// Маршруты lazy-раздела: пути относительны родительского 'users',
// а каждый компонент грузится отдельным chunk'ом через loadComponent
export const USERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./users').then((m) => m.Users),
    title: 'Пользователи',
  },
  {
    path: ':id',
    loadComponent: () => import('./user-detail').then((m) => m.UserDetail),
    title: 'Пользователь',
  },
];
