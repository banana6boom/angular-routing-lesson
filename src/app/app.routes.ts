import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Users } from './pages/users/users';
import { UserDetail } from './pages/users/user-detail';
import { NotFound } from './pages/not-found/not-found';
import { FeatureFlagsService } from './shared/feature-flags';

// Порядок: пустой → статические → параметризованные → wildcard (слайд 20)
export const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home, title: 'Главная' },
  { path: 'about', component: About, title: 'О приложении' },
  // pathMatch: 'full' — URL должен совпасть целиком: /docs редиректит, а /docs/intro → 404.
  // С 'prefix' (дефолт) достаточно совпадения НАЧАЛА URL — /docs/intro тоже редиректил бы.
  { path: 'docs', redirectTo: '/about', pathMatch: 'full' },
  // статический 'users' объявлен раньше параметризованного 'users/:id'
  { path: 'users', component: Users, title: 'Пользователи' },
  { path: 'users/:id', component: UserDetail, title: 'Пользователь' },
  {
    path: 'legacy/:id', // функция вызывается в injection context
    redirectTo: ({ params }) =>
      inject(FeatureFlagsService).newUserPage
        ? `/users/${params['id']}`
        : '/home',
  },
  { path: '**', component: NotFound, title: 'Страница не найдена' },
];
