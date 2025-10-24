import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { environmentP } from '../../environments/environment.prod';
import { api } from '../../environments/api';

// Importar SweetAlert2
declare const Swal: any;

@Component({ 
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  email: string = ''; 
  password: string = '';
  cargando: boolean = false;

  constructor(private router: Router, private http: HttpClient) {}

  login() {
    if (!this.email || !this.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los campos.',
      });
      return;
    }

    Swal.fire({
      title: 'Iniciando sesión...',
      html: 'Por favor espere',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.cargando = true;

    const datos = {
      email: this.email,
      password: this.password
    };

    
    let urlApi;
    if (api.production) {
      urlApi = environmentP.apiUrl;
    }else{
      urlApi = environment.apiUrl;
    }

    const url = `${urlApi}/login`;

    this.http.post(url, datos).subscribe(
      (res: any) => {
        this.cargando = false;
        Swal.close();

        if (res.status === 'success') {
          if (res.rol_id === 1) {
              Swal.fire({
                icon: 'success',
                title: `¡Login exitoso!`,
                text: `Bienvenido (${this.email})`,
                timer: 2000,
                showConfirmButton: false
              });
              localStorage.setItem('usuario', JSON.stringify({ 
                email: this.email, 
                tipo: res.tipo, 
                id: res.cliente_id,
                rol_id: res.rol_id
              }));
              setTimeout(() => {
                this.router.navigate(['/menu']);
              }, 2000);
          } else {
            Swal.fire({
              icon: 'info',
              title: 'Acceso en mantenimiento',
              text: 'Solo los usuarios clientes pueden acceder actualmente.'
            });
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: res.message
          });
        }
      },
      (err) => {
        this.cargando = false;
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Credenciales inválidas',
          text: 'Intenta nuevamente.'
        });
      }
    );
  }
}
