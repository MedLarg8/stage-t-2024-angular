import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(public _shared: SharedService, public router: Router){}

  takeToUsers(){
    this.router.navigate(['/users'])
  }

  takeToTransactions(){
    this.router.navigate(['/transactions'])
  }
}
