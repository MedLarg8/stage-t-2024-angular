import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { username, password });
  }

  register(username: string, password: string, image: File | null): Observable<any> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    if (image) {
      formData.append('image', image);
    }
    return this.http.post<any>(`${this.baseUrl}/register`, formData);
  }
}
