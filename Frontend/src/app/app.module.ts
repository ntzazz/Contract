import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContractListComponent } from './contract-list/contract-list.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'contracts', component: ContractListComponent }
];

@NgModule({
  declarations: [AppComponent, LoginComponent, DashboardComponent, ContractListComponent],
  imports: [BrowserModule, HttpClientModule, FormsModule, RouterModule.forRoot(routes), ChartsModule],
  bootstrap: [AppComponent]
})
export class AppModule { }