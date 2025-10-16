import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { environmentP } from '../../environments/environment.prod';
import { api } from '../../environments/api';


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
      alert('Por favor, completa todos los campos.');
      return;
    }

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

        if (res.status === 'success') {
          if (res.rol_id === 1) {
              alert(`Login exitoso (${res.tipo})!`);
              localStorage.setItem('usuario', JSON.stringify({ 
                email: this.email, 
                tipo: res.tipo, 
                id: res.cliente_id,
                rol_id: res.rol_id
              }));
              this.router.navigate(['/menu']);
          } else {
            alert('Acceso en mantenimiento. Solo usuarios clientes pueden acceder actualmente.');
          }
        } else {
          alert(res.message);
        }
      },
      (err) => {
        this.cargando = false;
        console.error(err);
        alert('Credenciales inválidas. Intenta nuevamente.');
      }
    );
  }
}
