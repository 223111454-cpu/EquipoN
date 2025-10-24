import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { environmentP } from '../../environments/environment.prod';
import { api } from '../../environments/api';

declare const Swal: any;
declare const lucide: any;

@Component({
  selector: 'app-transferir',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule],
  templateUrl: './transferir.html',
  styleUrl: './transferir.css'
})
export class Transferir implements OnInit, AfterViewInit {
  @ViewChild('qrVideo') qrVideo!: ElementRef<HTMLVideoElement>;

  rolNombre: string = '';
  cliente_id: number = 0;
  email: string = '';
  cargando: boolean = true;
  nombre: string = '';
  apellidos: string = '';
  numeroCuenta: string = '';
  saldo: number = 0;
  limiteDiario: number = 0;
  monto: string = '0';

  destinatarios: any[] = [];
  destinatarioSeleccionado: any = null;
  mostrarModal: boolean = false;
  nuevoDestinatario = { nombre: '', apellidos: '', banco: '', clabe: '' };
  escanearQR: boolean = false;
  descripcion: string = '';


  private stream: MediaStream | null = null;
  private scanning: boolean = false;
  private canvas: HTMLCanvasElement | null = null;
  private canvasContext: CanvasRenderingContext2D | null = null;

  constructor(public router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.cargarUsuario();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }, 100);
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

    let urlApi = api.production ? environmentP.apiUrl : environment.apiUrl;
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
        }
        this.cargarDestinatarios(usuario.id);
        this.cargando = false;
      },
      (err) => {
        console.error('Error cargando info de usuario', err);
        this.cargando = false;
      }
    );
  }

  cargarDestinatarios(codCliente: number) {
    let urlApi = api.production ? environmentP.apiUrl : environment.apiUrl;
    const url = `${urlApi}/consultar_destinatarios?cod_cliente=${codCliente}`;
    this.http.get(url).subscribe((res: any) => {
      if (res.status === 'success') {
        this.destinatarios = res.destinatarios;
      }
    });
  }

  abrirModal() {
    this.mostrarModal = true;
    this.escanearQR = false;
    this.nuevoDestinatario = { nombre: '', apellidos: '', banco: '', clabe: '' };
  }

  cerrarModal() {
    this.cerrarEscanerQR();
    this.mostrarModal = false;
    this.nuevoDestinatario = { nombre: '', apellidos: '', banco: '', clabe: '' };
  }

  guardarDestinatario() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (!this.nuevoDestinatario.nombre || !this.nuevoDestinatario.apellidos || !this.nuevoDestinatario.banco || !this.nuevoDestinatario.clabe) {
      Swal.fire('Campos incompletos', 'Llena todos los campos.', 'warning');
      return;
    }
    let urlApi = api.production ? environmentP.apiUrl : environment.apiUrl;
    const url = `${urlApi}/agregar_destinatario`;
    const body = {
      cod_cliente: usuario.id,
      nombre: `${this.nuevoDestinatario.nombre} ${this.nuevoDestinatario.apellidos}`,
      banco: this.nuevoDestinatario.banco,
      clabe: this.nuevoDestinatario.clabe
    };
    this.http.post(url, body).subscribe(
      (res: any) => {
        if (res.status === 'success') {
          Swal.fire('Agregado', 'Destinatario agregado exitosamente.', 'success');
          this.cargarDestinatarios(usuario.id);
          this.cerrarModal();
        }
      },
      () => Swal.fire('Error', 'No se pudo agregar el destinatario.', 'error')
    );
  }

  async mostrarEscanerQR() {
    this.escanearQR = true;
    
    setTimeout(async () => {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        
        if (this.qrVideo && this.qrVideo.nativeElement) {
          this.qrVideo.nativeElement.srcObject = this.stream;
          this.scanning = true;
          this.iniciarEscaneo();
        }
      } catch (error) {
        console.error('Error al acceder a la cámara:', error);
        Swal.fire('Error', 'No se pudo acceder a la cámara. Verifica los permisos.', 'error');
        this.escanearQR = false;
      }
    }, 100);
  }

  iniciarEscaneo() {
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvasContext = this.canvas.getContext('2d');
    }

    const escanear = () => {
      if (!this.scanning || !this.qrVideo?.nativeElement) return;

      const video = this.qrVideo.nativeElement;
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        this.canvas!.width = video.videoWidth;
        this.canvas!.height = video.videoHeight;
        this.canvasContext!.drawImage(video, 0, 0);

        const imageData = this.canvasContext!.getImageData(
          0,
          0,
          this.canvas!.width,
          this.canvas!.height
        );

        // Usar jsQR para decodificar
        const code = (window as any).jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          this.onScanSuccess(code.data);
          return;
        }
      }

      requestAnimationFrame(escanear);
    };

    escanear();
  }

  onScanSuccess(resultado: string) {
    this.scanning = false;
    this.cerrarEscanerQR();

    try {
      const lineas = resultado.split('\n');
      let nombre = '';
      let apellido = '';
      let banco = '';
      let clabe = '';

      lineas.forEach((linea: string) => {
        const [clave, valor] = linea.split(':').map(s => s.trim());
        if (clave.toUpperCase().includes('NOMBRE')) nombre = valor;
        if (clave.toUpperCase().includes('APELLIDO')) apellido = valor;
        if (clave.toUpperCase().includes('BANCO')) banco = valor;
        if (clave.toUpperCase().includes('CLABE')) clabe = valor;
      });

      if (nombre && apellido && banco && clabe) {
        this.nuevoDestinatario.nombre = nombre;
        this.nuevoDestinatario.apellidos = apellido;
        this.nuevoDestinatario.banco = banco;
        this.nuevoDestinatario.clabe = clabe;
        Swal.fire('¡QR leído!', 'Datos cargados correctamente desde el código QR.', 'success');
      } else {
        Swal.fire('Error', 'El código QR no contiene todos los datos necesarios.', 'error');
      }
    } catch (error) {
      console.error('Error al procesar QR:', error);
      Swal.fire('Error', 'No se pudo leer el código QR correctamente.', 'error');
    }
  }

  cerrarEscanerQR() {
    this.scanning = false;
    this.escanearQR = false;
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  onMontoInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let valor = input.value;

    if (valor && parseInt(valor) < 0) {
      this.monto = '0';
      return;
    }

    if (valor === '') {
      this.monto = '';
    } else {
      this.monto = parseInt(valor, 10).toString();
    }
  }

  onMontoFocus() {
    if (this.monto === '0') {
      this.monto = '';
    }
  }

  onMontoBlur() {
    if (this.monto === '') {
      this.monto = '0';
    }
  }

  getInputWidth(): string {
    const length = this.monto === '0' || this.monto === '' ? 1 : this.monto.length;
    return `${length}ch`;
  }

  continuar() {

    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.cliente_id = usuario.id;

    const montoNumerico = parseFloat(this.monto);

    if (montoNumerico <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Monto inválido',
        text: 'Por favor ingresa un monto válido.',
      });
      return;
    }

    if (!this.destinatarioSeleccionado) {
      Swal.fire('Sin destinatario', 'Selecciona un destinatario antes de transferir.', 'warning');
      return;
    }

    if (montoNumerico > this.saldo) {
      Swal.fire({
        icon: 'error',
        title: 'Saldo insuficiente',
        text: 'Tu saldo disponible no es suficiente para esta transferencia.',
      });
      return;
    }

    if (montoNumerico > this.limiteDiario) {
      Swal.fire({
        icon: 'warning',
        title: 'Límite diario excedido',
        text: `El monto excede el límite diario de $${this.limiteDiario.toLocaleString()}.`,
      });
      return;
    }


    console.log('Procesando transferencia de $' + montoNumerico);

    Swal.fire({
      title: `Enviando transferencia a ${this.destinatarioSeleccionado.nombre}...`,
      text: 'Por favor espere mientras se procesa la transferencia.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    const body = {
      cliente_id: this.cliente_id,
      banco: this.destinatarioSeleccionado.banco,
      clabe: this.destinatarioSeleccionado.clabe,
      nombre: this.destinatarioSeleccionado.nombre,
      monto: montoNumerico,
      descripcion: this.descripcion
    };


    this.http.post('https://n8n.automatizaciones.xyz/webhook/BancaUpmh', body)
      .subscribe({
        next: (res: any) => {
          if (res.Enviado === true) {
            Swal.fire({
              icon: 'success',
              title: 'Transferencia completada',
              text: `La transferencia de $${montoNumerico.toLocaleString()} a ${this.destinatarioSeleccionado.nombre} fue procesada exitosamente.`,
            }).then(() => {
              window.location.reload();
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error en la transferencia',
              text: 'La API respondió con un fallo en el envío. Inténtalo de nuevo.',
            });
          }
        },
        error: (err) => {
          console.error('Error al contactar con la API', err);
          Swal.fire({
            icon: 'error',
            title: 'Error en la conexión',
            text: 'No se pudo contactar con el servidor. Verifica tu conexión o inténtalo más tarde.',
          });
        }
      });


  }
}