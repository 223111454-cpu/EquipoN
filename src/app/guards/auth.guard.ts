import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard_client: CanActivateFn = () => {
  const router = inject(Router);
  const usuarioString = localStorage.getItem('usuario');

  if (!usuarioString) {
    alert('Acceso denegado. Por favor inicia sesión.');
    router.navigate(['/login']);
    return false;
  }

  let usuario;
  try {
    usuario = JSON.parse(usuarioString);
    console.log(usuario);
  } catch (e) {
    console.error('Error al parsear usuario:', e);
    alert('Acceso denegado. Problema interno.');
    router.navigate(['/login']);
    return false;
  }

  if (usuario.rol_id === 1) {
    return true;
  } else {
    alert('Acceso denegado. Solo usuarios clientes pueden acceder.');
    router.navigate(['/login']);
    return false;
  }
};
