import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-blockchain',
  templateUrl: './blockchain.component.html',
  styleUrls: ['./blockchain.component.css']
})
export class BlockchainComponent {

  constructor(public _shared: SharedService, public router: Router){}

  ngOnInit(){
    this.getBlockchain()
  }

  getBlockchain(){
    this._shared.getBlockchain().subscribe(
      data => {
        this._shared.blockchain = data
        console.log(this._shared.blockchain)
      },
      error => { 
        console.error("error fetching blockchain", error) }
    )
  }

  takeToDetailedTransactions(id: number){
    this.router.navigate(['transaction_details', id])
  }

  deleteBlock(id : number){
    if(confirm('Do You Really Want to Delete this Block?')){
      this._shared.deleteBlock(id).subscribe(
        response => {
          console.log(response.message)
        },
        error => {
          console.error("error deleting transaction", error)
        }
      )
    }
  }

}
