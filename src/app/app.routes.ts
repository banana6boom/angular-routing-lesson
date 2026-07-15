import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Settings } from './pages/settings/settings';
import { NotFound } from './pages/not-found/not-found';
import { FeatureFlagsService } from './shared/feature-flags';

// Порядок: пустой → статические → параметризованные → wildcard (слайд 20)
export const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home, title: 'Главная' },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about').then((m) => m.About),
    title: 'О приложении',
    data: { preload: true },
  },
  // pathMatch: 'full' — URL должен совпасть целиком: /docs редиректит, а /docs/intro → 404.
  // С 'prefix' (дефолт) достаточно совпадения НАЧАЛА URL — /docs/intro тоже редиректил бы.
  { path: 'docs', redirectTo: '/about', pathMatch: 'full' },
  // loadChildren: весь раздел users уезжает в отдельный chunk одним импортом
  {
    path: 'users',
    loadChildren: () => import('./pages/users/users.routes').then((m) => m.USERS_ROUTES),
  },
  {
    path: 'settings',
    component: Settings,
    title: 'Настройки',
    children: [
      {
        path: 'profile',
        loadComponent: () => import('./pages/settings/profile').then((m) => m.Profile),
        title: 'Профиль',
      },
    ],
  },
  {
    path: 'legacy/:id', // функция вызывается в injection context
    redirectTo: ({ params }) =>
      inject(FeatureFlagsService).newUserPage
        ? `/users/${params['id']}`
        : '/home',
  },
  { path: '**', component: NotFound, title: 'Страница не найдена' },
];
