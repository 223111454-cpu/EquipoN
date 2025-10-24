import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { environmentP } from '../../environments/environment.prod';
import { api } from '../../environments/api';

// Importar SweetAlert2 (usando el CDN global)
declare const Swal: any;

@Component({
  selector: 'app-registro-ex',
  standalone: true,
  imports: [FormsModule, RouterModule, HttpClientModule],
  templateUrl: './registro-ex.html',
  styleUrls: ['./registro-ex.css']
})
export class RegistroEX {
  nombre: string = '';
  apellidos: string = '';
  correo: string = '';
  confirmarCorreo: string = '';
  phone: string = '';
  contrasena: string = '';
  pasaporte: string = '';
  pais: string = '';
  cargando: boolean = false;

  constructor(private router: Router, private http: HttpClient) {}

  registro() {
    if (!this.nombre || !this.apellidos || !this.correo || !this.confirmarCorreo ||
        !this.phone || !this.contrasena || !this.pasaporte || !this.pais) {
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los campos antes de continuar.',
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

    const datos = {
      nombre: this.nombre,
      apellidos: this.apellidos,
      correo: this.correo,
      phone: this.phone,
      contrasena: this.contrasena,
      pasaporte: this.pasaporte,
      pais: this.pais
    };

    this.cargando = true;

    let urlApi = api.production ? environmentP.apiUrl : environment.apiUrl;
    const url = `${urlApi}/registro_EX`;

    // Mostrar modal de carga
    Swal.fire({
      title: 'Registrando usuario...',
      html: 'Por favor espere un momento',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Petición HTTP
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
          text: 'Ocurrió un problema al procesar el registro. Intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Entendido'
        });
      }
    );
  }

  onpais(event: Event) {
    const input = event.target as HTMLInputElement;
    this.pais = input.value;
  }

  onpasaporte(event: Event) {
    const input = event.target as HTMLInputElement;
    this.pasaporte = input.value;
  }
}