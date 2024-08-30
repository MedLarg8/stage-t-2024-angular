import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.css']
})
export class TransactionDetailsComponent {

  constructor(public route: ActivatedRoute, public _shared: SharedService, public router: Router){}

  id : number = 0

  ngOnInit(): void{
    this.route.params.subscribe(
      params => this.id = +params['id']
    )
    this.filterTransaction()
  }

  transaction_filtred: any = [];

  filterTransaction(): void {
    if (this._shared.transactions && this._shared.transactions.length > 0) {
      this.transaction_filtred = this._shared.transactions.find(t => t.id === this.id);
    }
    console.log(this._shared.transactions)
    console.log(this.transaction_filtred)
  }

  deleteTransaction(id : number){
    if(confirm('Do You Really Want to Delete this Transaction?')){
      this._shared.deleteTransaction(id).subscribe(
        response => {
          console.log(response.message)
          this.router.navigate(['/transactions'])
        },
        error => {
          console.error("error deleting transaction", error)
        }
      )
    }
  }
}
