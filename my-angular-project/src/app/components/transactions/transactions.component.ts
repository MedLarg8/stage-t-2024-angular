import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent {
  constructor(public _shared: SharedService, private router: Router){}

  ngOnInit() : void{
    this.getTransactions()
  }

  getTransactions(): void {
    this._shared.getTransactions().subscribe(
      data => {
        this._shared.transactions = data;
        console.log(this._shared.transactions);
      },
      error => {
        console.log(this._shared.transactions)
        console.error('Error fetching transactions:', error);
      }
    );
  }

  takeToDetailedTransactions(id: number){
    this.router.navigate(['transaction_details', id])
  }

}
