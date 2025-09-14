import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,       
  imports: [FormsModule, RouterModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class Registro {

  nombre: string = '';
  apellidos: string = '';
  correo: string = '';
  confirmarCorreo: string = '';
  phone: string = '';
  contrasena: string = '';
  claveElectoral: string = '';

  constructor(private router: Router) {}

  registro() {
    // Validaciones
    if (this.correo !== this.confirmarCorreo) {
      alert('Los correos electrónicos no coinciden');
      return;
    }

    if (this.claveElectoral.length !== 10) {
      alert('La clave electoral debe tener exactamente 10 dígitos');
      return;
    }

    console.log('Registro exitoso!');
    console.log('Nombre:', this.nombre);
    console.log('Apellidos:', this.apellidos);
    console.log('Correo:', this.correo);
    console.log('Teléfono:', this.phone);
    console.log('Contraseña:', this.contrasena);
    console.log('Clave electoral:', this.claveElectoral);

    // Redirigir a /menu
    this.router.navigate(['/menu']);
  }

  // Permitir solo números en clave electoral
  onClaveElectoralInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    if (input.value.length > 10) {
      input.value = input.value.slice(0, 10);
    }
    this.claveElectoral = input.value;
  }
}
