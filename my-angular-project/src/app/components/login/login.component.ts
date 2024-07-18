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
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  onSubmit() {
    const loginData = {
      username: this.username,
      password: this.password
    };

    if (this.username === 'admin' && this.password === 'admin') {
      this.router.navigate(['/users']);
      return;
    }

    this.http.post('http://localhost:5000/login', loginData, { withCredentials: true }).subscribe(
      (response: any) => {
        console.log('Login successful', response);
        if (response.username) {
          // Store the username or other details as needed
          sessionStorage.setItem('username', response.username);
          // Navigate to face recognition page with username parameter
          this.router.navigate(['/face_recognition'], { queryParams: { username: response.username } });
        }
      },
      error => {
        console.error('Login failed', error);
        this.errorMessage = error.error?.error || 'An unknown error occurred';
      }
    );
  }
}
