import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { environmentP } from '../../environments/environment.prod';
import { api } from '../../environments/api';
import * as QRCode from 'qrcode';
import QRCodeStyling from 'qr-code-styling';


declare const lucide: any;

@Component({
  selector: 'app-tu-dinero',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './tu-dinero.html',
  styleUrl: './tu-dinero.css'
})
export class TuDinero implements OnInit {

  rolNombre: string = '';
  email: string = '';
  cargando: boolean = true;

  nombre: string = '';
  apellidos: string = '';
  numeroCuenta: string = '';
  saldo: number = 0;
  limiteDiario: number = 0;

  // Variables para el modal
  mostrarModal: boolean = false;
  qrCodeUrl: string = '';
  mensajeCopiado: boolean = false;
  
  // Nueva variable para los movimientos
  movimientos: any[] = [];

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
            this.consultarMovimientos();

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



  consultarMovimientos() {
    if (!this.numeroCuenta) {
      console.warn('No se puede consultar movimientos: número de cuenta vacío');
      return;
    }

    let urlApi;
    if (api.production) {
      urlApi = environmentP.apiUrl;
    } else {
      urlApi = environment.apiUrl;
    }

    const url = `${urlApi}/movimientos?numero_cuenta=${this.numeroCuenta}`;

    this.http.get(url).subscribe(
      (res: any) => {
        if (res.status === 'success') {
          this.movimientos = res.movimientos;
          console.log('Movimientos consultados:', this.movimientos);
        } else {
          console.warn('Error consultando movimientos:', res.message);
        }
      },
      (err) => {
        console.error('Error al obtener movimientos:', err);
      }
    );
  }

  async abrirModalClabe() {
    this.mostrarModal = true;
    await this.generarQR();
    
    setTimeout(() => {
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }, 100);
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.mensajeCopiado = false;
  } 

  async generarQR() {
    const datosQR = `NOMBRE: ${this.nombre}\nAPELLIDO: ${this.apellidos}\nBANCO: BANCA UPMH\nCLABE: ${this.numeroCuenta}`;

    const qrCode = new QRCodeStyling({
      width: 300,
      height: 300,
      data: datosQR,
      image: 'https://s3.amazonaws.com/www.codeflex.lat/documentos/f03dd06f-3df0-4831-a26e-e8daa6cbdde6/upmlogo23.png',
      imageOptions: {
        crossOrigin: 'anonymous',
        imageSize: 0.20, 
        margin: 4 
      },
      dotsOptions: {
        color: "#000",
        type: "square"
      },
      backgroundOptions: {
        color: "#fff"
      },
      qrOptions: {
        errorCorrectionLevel: "H"
      }
    });

    setTimeout(() => {
      const qrDiv = document.getElementById("qrDiv");
      if (qrDiv) {
        qrDiv.innerHTML = ""; 
        qrCode.append(qrDiv); 
      }
    }, 0);
  }


  copiarAlPortapapeles() {
    const texto = `NOMBRE: ${this.nombre}\nAPELLIDO: ${this.apellidos}\nBANCO: BANCA UPMH\nCLABE: ${this.numeroCuenta}`;
    
    navigator.clipboard.writeText(texto).then(() => {
      this.mensajeCopiado = true;
      setTimeout(() => {
        this.mensajeCopiado = false;
      }, 2000);
    }).catch(err => {
      console.error('Error al copiar:', err);
    });
  }
}