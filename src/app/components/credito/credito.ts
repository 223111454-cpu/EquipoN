import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
        alert('Solo se permiten archivos PDF.');
        input.value = '';
        return;
      }
      if (type === 'ine') this.ineFile = file;
      if (type === 'cd') this.cdFile = file;
      if (type === 'comprobante') this.comprobanteIngresosFile = file;
    }
  }

  enviarCredito() {
    if (!this.ineFile || !this.cdFile || !this.comprobanteIngresosFile) {
      alert('Por favor, selecciona todos los archivos PDF requeridos.');
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

    console.log('Datos de la solicitud:', data);
    alert('Solicitud enviada correctamente');
    this.router.navigate(['/aprobadoC']);
  }

  cerrarSesion() {
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

}
