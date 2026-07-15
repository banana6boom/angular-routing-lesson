import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';

export const appRoutes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
];
