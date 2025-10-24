import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { environmentP } from '../../environments/environment.prod';
import { api } from '../../environments/api';

// Importar SweetAlert2 (usando el CDN global en index.html)
declare const Swal: any;

@Component({
  selector: 'app-registro-mx',
  standalone: true,
  imports: [FormsModule, RouterModule, HttpClientModule],
  templateUrl: './registro-mx.html',
  styleUrls: ['./registro-mx.css']
})
export class RegistroMX {
  nombre: string = '';
  apellidos: string = '';
  correo: string = '';
  confirmarCorreo: string = '';
  phone: string = '';
  contrasena: string = '';
  claveElectoral: string = '';
  curpElectoral: string = '';
  fechaEmision: string = '';
  fechaVencimiento: string = '';
  cargando: boolean = false;

  constructor(private router: Router, private http: HttpClient) {}

  registro() {
    if (!this.nombre || !this.apellidos || !this.correo || !this.confirmarCorreo || 
        !this.phone || !this.contrasena || !this.claveElectoral || 
        !this.curpElectoral || !this.fechaEmision || !this.fechaVencimiento) {
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Todos los campos son obligatorios.',
        icon: 'warning',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    if (this.correo !== this.confirmarCorreo) {
      Swal.fire({
        title: 'Correos no coinciden',
        text: 'Los correos electrónicos ingresados deben ser iguales.',
        icon: 'error',
        confirmButtonText: 'Corregir'
      });
      return;
    }

    if (this.claveElectoral.length !== 10) {
      Swal.fire({
        title: 'Clave electoral inválida',
        text: 'La clave electoral debe tener exactamente 10 dígitos.',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    if (this.curpElectoral.length !== 18) {
      Swal.fire({
        title: 'CURP inválido',
        text: 'El CURP debe tener exactamente 18 caracteres.',
        icon: 'error',
        confirmButtonText: 'Corregir'
      });
      return;
    }

    const datos = {
      nombre: this.nombre,
      apellidos: this.apellidos,
      correo: this.correo,
      phone: this.phone,
      contrasena: this.contrasena,
      claveElectoral: this.claveElectoral,
      curpElectoral: this.curpElectoral,
      fechaEmision: this.fechaEmision,
      fechaVencimiento: this.fechaVencimiento
    };

    this.cargando = true;

    let urlApi = api.production ? environmentP.apiUrl : environment.apiUrl;
    const url = `${urlApi}/registro_MX`;

    // Muestra un loader visual mientras se envía la solicitud
    Swal.fire({
      title: 'Procesando registro...',
      html: 'Por favor espere mientras completamos su solicitud.',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.http.post(url, datos).subscribe(
      (res: any) => {
        this.cargando = false;
        Swal.close();

        if (res.status === 'success') {
          Swal.fire({
            title: 'Registro exitoso',
            text: res.message,
            icon: 'success',
            confirmButtonText: 'Ir al login'
          }).then(() => {
            this.router.navigate(['/login']);
          });
        } else {
          Swal.fire({
            title: 'Error en el registro',
            text: res.message,
            icon: 'error',
            confirmButtonText: 'Cerrar'
          });
        }
      },
      (err) => {
        this.cargando = false;
        Swal.close();
        console.error(err);

        Swal.fire({
          title: 'Error de conexión',
          text: 'Ocurrió un problema al procesar su registro. Inténtelo nuevamente.',
          icon: 'error',
          confirmButtonText: 'Entendido'
        });
      }
    );
  }

  onClaveElectoralInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    if (input.value.length > 10) {
      input.value = input.value.slice(0, 10);
    }
    this.claveElectoral = input.value;
  }

  onClaveFechaEmision(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    if (input.value.length > 4) {
      input.value = input.value.slice(0, 4);
    }
    this.fechaEmision = input.value;
  }

  onClaveFechaVencimiento(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    if (input.value.length > 4) {
      input.value = input.value.slice(0, 4);
    }
    this.fechaVencimiento = input.value;
  }

  onCurpElectoralInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.curpElectoral = input.value;
  }
}