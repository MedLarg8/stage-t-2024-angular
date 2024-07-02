import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent {
  recipient: string = '';
  value: number = 0;

  constructor(private http: HttpClient) { }

  onSubmit() {
    const transactionData = {
      recipient: this.recipient,
      value: this.value
    };

    this.http.post('http://localhost:5000/transaction', transactionData).subscribe(
      response => {
        console.log('Transaction successful', response);
      },
      error => {
        console.error('Transaction failed', error);
      }
    );
  }
}
