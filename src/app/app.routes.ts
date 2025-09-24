import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Registro } from './components/registro/registro';
import { RegistroMX } from './components/registro-mx/registro-mx';
import { RegistroEX } from './components/registro-ex/registro-ex';
import { Inicio } from './components/inicio/inicio';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'inicio', component: Inicio },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'registro_MX', component: RegistroMX },
  { path: 'registro_EX', component: RegistroEX },
  { 
    path: 'menu', 
    loadComponent: () => import('./components/menu/menu').then(m => m.Menu), 
    canActivate: [authGuard] 
  },
  { 
    path: 'credito', 
    loadComponent: () => import('./components/credito/credito').then(m => m.Credito), 
    canActivate: [authGuard] 
  },
  { 
    path: 'prestamo', 
    loadComponent: () => import('./components/prestamo/prestamo').then(m => m.Prestamo), 
    canActivate: [authGuard] 
  },
  { 
    path: 'aprobadoC', 
    loadComponent: () => import('./components/aprobado-c/aprobado-c').then(m => m.AprobadoC), 
    canActivate: [authGuard] 
  },
  { 
    path: 'aprobadoP', 
    loadComponent: () => import('./components/aprobado-p/aprobado-p').then(m => m.AprobadoP), 
    canActivate: [authGuard] 
  },
  { path: '', redirectTo: '/inicio', pathMatch: 'full' }
];