import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
        alert('Por favor, completa todos los campos antes de continuar.');
        return;
    }

    if (this.correo !== this.confirmarCorreo) {
      alert('Los correos electrónicos no coinciden');
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
    const url = 'http://localhost:3001/registro_EX';

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

  onpais(event: Event) {
    const input = event.target as HTMLInputElement;
    this.pais = input.value;
  }

  onpasaporte(event: Event) {
    const input = event.target as HTMLInputElement;
    this.pasaporte = input.value;
  }
}