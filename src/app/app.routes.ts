import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Registro } from './components/registro/registro';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'Registro', component: Registro },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
