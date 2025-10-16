import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { environmentP } from '../../environments/environment.prod';
import { api } from '../../environments/api';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class Menu implements OnInit {
  rolNombre: string = '';
  email: string = '';
  cargando: boolean = true;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.cargarUsuario();
  }

  cerrarSesion() {
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  cargarUsuario() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (!usuario?.id || !usuario?.tipo) {
      this.cargando = false;
      return;
    }

    this.email = usuario.email;

    let urlApi;
    if (api.production) {
      urlApi = environmentP.apiUrl;
    }else{
      urlApi = environment.apiUrl;
    }

    const url = `${urlApi}/usuario_info?cliente_id=${usuario.id}&tipo=${usuario.tipo}`;

    this.http.get(url).subscribe(
      (res: any) => {
        if (res.status === 'success') {
          this.rolNombre = res.usuario.rol;
        } else {
          console.warn(res.message);
        }
        this.cargando = false;
      },
      (err) => {
        console.error('Error cargando info de usuario', err);
        this.cargando = false;
      }
    );
  }
}
