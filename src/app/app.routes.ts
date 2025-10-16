import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Registro } from './components/registro/registro';
import { RegistroMX } from './components/registro-mx/registro-mx';
import { RegistroEX } from './components/registro-ex/registro-ex';
import { Inicio } from './components/inicio/inicio';
import { authGuard_client } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'inicio', component: Inicio },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'registro_MX', component: RegistroMX },
  { path: 'registro_EX', component: RegistroEX },
  { 
    path: 'menu', 
    loadComponent: () => import('./components/menu/menu').then(m => m.Menu), 
    canActivate: [authGuard_client] 
  },
  { 
    path: 'credito', 
    loadComponent: () => import('./components/credito/credito').then(m => m.Credito), 
    canActivate: [authGuard_client] 
  },
  { 
    path: 'prestamo', 
    loadComponent: () => import('./components/prestamo/prestamo').then(m => m.Prestamo), 
    canActivate: [authGuard_client] 
  },
  { 
    path: 'aprobadoC', 
    loadComponent: () => import('./components/aprobado-c/aprobado-c').then(m => m.AprobadoC), 
    canActivate: [authGuard_client] 
  },
  { 
    path: 'aprobadoP', 
    loadComponent: () => import('./components/aprobado-p/aprobado-p').then(m => m.AprobadoP), 
    canActivate: [authGuard_client] 
  },
  { path: '', redirectTo: '/inicio', pathMatch: 'full' }
];