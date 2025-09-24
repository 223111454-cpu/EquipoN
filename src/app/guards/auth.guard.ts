import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const usuario = localStorage.getItem('usuario');

  if (usuario) {
    return true;
  } else {
    alert('Acceso denegado. Por favor inicia sesion.');
    router.navigate(['/login']);
    return false;
  }
};