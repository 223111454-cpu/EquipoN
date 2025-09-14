import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Registro } from './components/registro/registro';
import { Menu } from './components/menu/menu';
import { Credito } from './components/credito/credito';
import { Prestamo } from './components/prestamo/prestamo';
import { AprobadoC } from './components/aprobado-c/aprobado-c';
import { AprobadoP } from './components/aprobado-p/aprobado-p';
import { Inicio } from './components/inicio/inicio';


export const routes: Routes = [
  { path: 'inicio', component: Inicio },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'menu', component: Menu },
  { path: 'credito', component: Credito },
  { path: 'prestamo', component: Prestamo },
  { path: 'aprobadoC', component: AprobadoC },
  { path: 'aprobadoP', component: AprobadoP },
  { path: '', redirectTo: '/inicio', pathMatch: 'full' }
];