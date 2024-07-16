import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FaceRecognitionComponent } from './components/face-recognition/face-recognition.component';
import { TransactionComponent } from './components/transaction/transaction.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { UsersComponent } from './components/users/users.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { BlockchainComponent } from './components/blockchain/blockchain.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TransactionDetailsComponent } from './components/transaction-details/transaction-details.component';
import { RouterOutlet } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    FaceRecognitionComponent,
    TransactionComponent,
    AdminPanelComponent,
    UsersComponent,
    TransactionsComponent,
    BlockchainComponent,
    NavbarComponent,
    TransactionDetailsComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterOutlet
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
