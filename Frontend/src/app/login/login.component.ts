import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  userId = '';
  password = '';
  captcha = '';
  message = '';
  error = false;

  constructor(private router: Router) {}

  login() {
    if (this.captcha === 'XYZ123') {
      this.router.navigate(['/dashboard']);
    } else {
      this.message = 'Invalid CAPTCHA';
      this.error = true;
    }
  }
}