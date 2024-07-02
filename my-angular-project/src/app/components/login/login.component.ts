import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  onSubmit() {
    const loginData = {
      username: this.username,
      password: this.password
    };
  
    this.http.post('http://localhost:5000/login', loginData, { withCredentials: true }).subscribe(
      response => {
        console.log('Login successful', response);
        // Navigate to another page after login
        this.router.navigate(['/face_recognition']);
      },
      error => {
        console.error('Login failed', error);
      }
    );
  }
}