import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FaceRecognitionComponent } from './components/face-recognition/face-recognition.component';
import { TransactionComponent } from './components/transaction/transaction.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { UsersComponent } from './components/users/users.component';
import { BlockchainComponent } from './components/blockchain/blockchain.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { TransactionDetailsComponent } from './components/transaction-details/transaction-details.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'admin_panel', component: AdminPanelComponent },
    { path: 'users', component: UsersComponent },
    { path: 'transactions', component: TransactionsComponent },
    { path: 'blockchain', component: BlockchainComponent },
    { path: 'transaction_details/:id', component: TransactionDetailsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'face_recognition', component: FaceRecognitionComponent },
  { path: 'transaction', component: TransactionComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
