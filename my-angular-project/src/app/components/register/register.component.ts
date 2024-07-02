import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  image: File | null = null;

  constructor(private http: HttpClient) { }

  onFileChange(event: any) {
    this.image = event.target.files[0];
  }

  onSubmit() {
    if (this.image) {
      const formData = new FormData();
      formData.append('username', this.username);
      formData.append('password', this.password);
      formData.append('image', this.image);

      this.http.post('http://localhost:5000/register', formData).subscribe(
        response => {
          console.log('Registration successful', response);
        },
        error => {
          console.error('Registration failed', error);
        }
      );
    }
  }
}
