import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private http: HttpClient) { }

  users: any[] = [];

  getUsers(): Observable<any>{
    return this.http.get('http://localhost:5000/users');
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`http://localhost:5000/users/${id}`);
  }

  transactions: any[] = [];

  getTransactions(): Observable<any>{
    return this.http.get('http://localhost:5000/transactions');
  }

  deleteTransaction(id: number): Observable<any>{
    return this.http.delete(`http://localhost:5000/transaction_details/${id}`);
  }
  
  blockchain: any[] = []

  getBlockchain(): Observable<any>{
    return this.http.get('http://localhost:5000/blockchain');
  }

  deleteBlock(id: number): Observable<any>{
    return this.http.delete(`http://localhost:5000/blockchain/${id}`);
  }
  
  isExpanded = false;

  toggleNavbar() {
    this.isExpanded = !this.isExpanded;
  }
}
