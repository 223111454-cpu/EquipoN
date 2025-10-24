import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

declare const Swal: any;

export const authGuard_client: CanActivateFn = () => {
  const router = inject(Router);
  const usuarioString = localStorage.getItem('usuario');

  if (!usuarioString) {
    Swal.fire({
      title: 'Acceso denegado',
      text: 'Por favor, inicia sesión para continuar.',
      icon: 'warning',
      confirmButtonText: 'Ir al login'
    }).then(() => {
      router.navigate(['/login']);
    });
    return false;
  }

  let usuario;
  try {
    usuario = JSON.parse(usuarioString);
    console.log(usuario);
  } catch (e) {
    console.error('Error al parsear usuario:', e);
    Swal.fire({
      title: 'Error interno',
      text: 'Ocurrió un problema con la sesión. Por favor vuelve a iniciar sesión.',
      icon: 'error',
      confirmButtonText: 'Ir al login'
    }).then(() => {
      router.navigate(['/login']);
    });
    return false;
  }


  if (usuario.rol_id === 1) {
    return true;
  } else {
    Swal.fire({
      title: 'Acceso restringido',
      text: 'Solo los usuarios clientes pueden acceder a esta sección.',
      icon: 'info',
      confirmButtonText: 'Entendido'
    }).then(() => {
      router.navigate(['/login']);
    });
    return false;
  }
};