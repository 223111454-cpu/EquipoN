import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
    if (!this.nombre || !this.apellidos || !this.correo || !this.confirmarCorreo || !this.phone || !this.contrasena || !this.claveElectoral || !this.curpElectoral || !this.fechaEmision || !this.fechaVencimiento) {
      alert('Todos los campos son obligatorios');
      return;
    }

    if (this.correo !== this.confirmarCorreo) {
      alert('Los correos electrónicos no coinciden');
      return;
    }

    if (this.claveElectoral.length !== 10) {
      alert('La clave electoral debe tener exactamente 10 dígitos');
      return;
    }

    if (this.curpElectoral.length !== 18) {
      alert('El CURP debe tener exactamente 18 caracteres');
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
    const url = 'http://localhost:3001/registro_MX';

    this.http.post(url, datos).subscribe(
      (res: any) => {
        this.cargando = false;
        if(res.status === 'success'){
          alert(res.message); 
          this.router.navigate(['/login']);
        } else {
          alert(res.message);
        }
      },
      (err) => {
        this.cargando = false;
        console.error(err);
        alert('Error en el registro. Intenta nuevamente.');
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

  onCurpElectoralInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.curpElectoral = input.value;
  }
}