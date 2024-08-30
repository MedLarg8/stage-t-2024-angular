import { Component } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {

  constructor(public _shared: SharedService){
  }

  ngOnInit(): void{
    this.getUsers()
  }

  getUsers(): void {
    this._shared.getUsers().subscribe(
      data => {
        this._shared.users = data;
        console.log(this._shared.users);
      },
      error => {
        console.log(this._shared.users)
        console.error('Error fetching users:', error);
      }
    );
  }

  deleteUser(id: number): void{
    if(confirm('Do you really want to delete this User?')){
    this._shared.deleteUser(id).subscribe(
      response => {
          this.getUsers();
          console.log(response.message)
        },
      error => {
        console.error('Error deleting user:', error);
      }
    );
    }
  }

  validate_imprint(id : number){
    this._shared.validate_imprint(id).subscribe(
      response => {
        this.getUsers();
        alert('User Imprint Validated')
      },
      error => {
        console.error('Error validating imprint:', error);
      }
    )
  }
}
