import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({ 
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  email: string = ''; 
  password: string = '';

  constructor(private router: Router) {}

  login() {
    console.log("Función login");
    console.log("Email:", this.email);
    console.log("Password:", this.password);

    if (this.email && this.password) {
      this.router.navigate(['/menu']);
    } else {
      alert('Por favor, completa todos los campos.');
    }
  }
}
