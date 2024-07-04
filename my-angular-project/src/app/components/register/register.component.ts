import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  image: File | null = null;
  errorMessage: string = '';

  constructor(private http: HttpClient, private router : Router) { }

  onFileChange(event: any) {
    this.image = event.target.files[0];
  }

  onSubmit() {
    if (this.image) {
      const formData = new FormData();
      formData.append('username', this.username);
      formData.append('password', this.password);
      formData.append('image', this.image);

      this.http.post('http://localhost:5000/register', formData, { withCredentials: true }).subscribe(
        response => {
          console.log('Registration successful', response);
          this.router.navigate(['/login'],);
        },
        error => {
          console.error('Registration failed', error);
          this.errorMessage = error.error?.error || "Unknow Error";
        }
      );
    }
  }
}
