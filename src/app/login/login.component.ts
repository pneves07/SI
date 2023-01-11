import { Component } from '@angular/core';
import { Router } from "@angular/router"


import mock from '../mock.json';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private router: Router) { }

  loggedIn = false;
  invalidLogin = false;

  email = mock.emailSuccess;
  password = mock.passwordSuccess;
  emailInput = "";
  passwordInput = "";
  
  login() {
    if (this.emailInput === this.email && this.passwordInput === this.password) {
      this.loggedIn = true;
      this.invalidLogin = false;
      this.router.navigate(['/home']);
      console.log("Grande Marco só chateia");
    }
    else {
      this.invalidLogin = true;
      this.loggedIn = false;  
      console.log("Grande Marco não chateia");    
    }
  }

}
