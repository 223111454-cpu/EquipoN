import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { environmentP } from '../../environments/environment.prod';
import { api } from '../../environments/api';

declare const lucide: any;

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

  nombre: string = '';
  apellidos: string = '';
  numeroCuenta: string = '';
  saldo: number = 0;
  limiteDiario: number = 0;

  constructor(public router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.cargarUsuario();

    setTimeout(() => {
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }, 500);
  }

  cerrarSesion() {
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }


  get saldoEntero(): string {
    return Math.floor(this.saldo).toLocaleString('es-MX');
  }

  get saldoDecimales(): string {
    return (this.saldo % 1).toFixed(2).split('.')[1];
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
    } else {
      urlApi = environment.apiUrl;
    }

    const url = `${urlApi}/usuario_info?cliente_id=${usuario.id}&tipo=${usuario.tipo}`;


    this.http.get(url).subscribe(
      (res: any) => {
        
        if (res.status === 'success') {
          this.rolNombre = res.usuario.rol;
          this.nombre = res.usuario.nombre;
          this.apellidos = res.usuario.apellidos;

          if (res.usuario.cuenta_debito) {
            this.numeroCuenta = res.usuario.cuenta_debito.numero_cuenta;
            this.saldo = Number(res.usuario.cuenta_debito.saldo);  
            this.limiteDiario = res.usuario.cuenta_debito.limite_diario;
          }
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
