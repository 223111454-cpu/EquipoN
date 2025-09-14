import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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

  constructor(private router: Router, private http: HttpClient) {}

  login() {
    if (!this.email || !this.password) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const datos = {
      email: this.email,
      password: this.password
    };

    const url = 'https://k.codeflex.com.co/BancaUpmh/login.php';

    this.http.post(url, datos).subscribe(
      (res: any) => {
        if (res.status === 'success') {
          alert('Login exitoso!');
          localStorage.setItem('usuario', JSON.stringify({ email: this.email }));
          this.router.navigate(['/menu']);
        } else {
          alert(res.message);
        }
      },
      (err) => {
        console.error(err);
        alert('Error en el login. Intenta nuevamente.');
      }
    );
  }
}