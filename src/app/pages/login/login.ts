import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  API_BASE = 'https://geohealth-backend-a2i9.onrender.com';

  loginEmail = '';
  loginPassword = '';

  registerName = '';
  registerEmail = '';
  registerPassword = '';

  constructor(
    private router: Router
  ) {}

  async register() {

    const response = await fetch(
      `${this.API_BASE}/api/users/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({
          name: this.registerName,
          email: this.registerEmail,
          password: this.registerPassword
        })
      }
    );

    const data = await response.json();

    alert(data.message);
  }

  async login() {

    const response = await fetch(
      `${this.API_BASE}/api/users/login`,
      {
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify({
          email:this.loginEmail,
          password:this.loginPassword
        })
      }
    );

    const data = await response.json();

    alert(data.message);

    if(response.ok){
      this.router.navigate(['/home']);
    }
  }
}
