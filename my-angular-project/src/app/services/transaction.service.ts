import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private baseUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  createTransaction(sender: string, recipient: string, value: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/transaction`, { sender, recipient, value });
  }
}
