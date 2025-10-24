import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

declare const Swal: any;

@Component({
  selector: 'app-credito',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './credito.html',
  styleUrls: ['./credito.css']
})
export class Credito {
  ocupacion: string = '';
  telefono: string = '';
  ingresos: string = '';
  direccion: string = '';

  ineFile: File | null = null;
  cdFile: File | null = null;
  comprobanteIngresosFile: File | null = null;

  constructor(private router: Router) {}

  onFileSelected(event: Event, type: 'ine' | 'cd' | 'comprobante') {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type !== 'application/pdf') {
        Swal.fire({
          title: 'Archivo inválido',
          text: 'Solo se permiten archivos PDF.',
          icon: 'error',
          confirmButtonText: 'Entendido'
        });
        input.value = '';
        return;
      }
      if (type === 'ine') this.ineFile = file;
      if (type === 'cd') this.cdFile = file;
      if (type === 'comprobante') this.comprobanteIngresosFile = file;

      Swal.fire({
        title: 'Archivo cargado',
        text: `Se cargó correctamente: ${file.name}`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    }
  }

  enviarCredito() {
    if (!this.ineFile || !this.cdFile || !this.comprobanteIngresosFile) {
      Swal.fire({
        title: 'Archivos incompletos',
        text: 'Por favor, selecciona todos los archivos PDF requeridos antes de enviar.',
        icon: 'warning',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    const data = {
      ocupacion: this.ocupacion,
      telefono: this.telefono,
      ingresos: this.ingresos,
      direccion: this.direccion,
      ineFile: this.ineFile.name,
      cdFile: this.cdFile.name,
      comprobanteIngresosFile: this.comprobanteIngresosFile.name
    };

    Swal.fire({
      title: 'Enviando solicitud...',
      html: 'Por favor espere unos segundos',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    setTimeout(() => {
      Swal.close();

      console.log('Datos de la solicitud:', data);

      Swal.fire({
        title: 'Solicitud enviada',
        text: 'Tu solicitud de crédito ha sido enviada correctamente.',
        icon: 'success',
        confirmButtonText: 'Continuar'
      }).then(() => {
        this.router.navigate(['/aprobadoC']);
      });
    }, 2000);
  }

  cerrarSesion() {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Seguro que quieres salir de tu cuenta?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        localStorage.removeItem('usuario');

        Swal.fire({
          title: 'Sesión cerrada',
          text: 'Has cerrado la sesión correctamente.',
          icon: 'info',
          timer: 1500,
          showConfirmButton: false
        });

        this.router.navigate(['/login']);
      }
    });
  }
}