import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent {
  recipient: string = '';
  value: number = 0;

  constructor(private http: HttpClient, private router: Router) { }

  onSubmit() {
    const sender = sessionStorage.getItem('username'); // Retrieve sender from session storage
    if (!sender) {
      console.error('Sender information not found in session.');
      return;
    }

    const transactionData = {
      sender: sender,
      recipient: this.recipient,
      value: this.value
    };

    this.http.post('http://localhost:5000/transaction', transactionData, { withCredentials: true }).subscribe(
      (response: any) => {
        console.log('Transaction successful', response);
        // Redirect to a success page if needed
        // this.router.navigate(['/transaction']);
      },
      error => {
        console.log('sender :'+sender)
        console.error('Transaction failed', error);
      }
    );
  }
}
