import { Component } from '@angular/core';
import { Router } from "@angular/router"
import getCustomers from '../api/get_customers.json'; 
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

  customer : any = {};
  //email = mock.emailSuccess;
  //password = mock.passwordSuccess;
  emailInput = "";
  passwordInput = "";
  

  login(){
    let allCustomers = getCustomers.data;
    for (let i = 0; i < allCustomers.length; i++){
      if (allCustomers[i].attributes.email === this.emailInput && allCustomers[i].id === this.passwordInput){
        this.customer = allCustomers[i];
        this.loggedIn = true;
        this.invalidLogin = false;
        this.router.navigate(['/home']);
        localStorage.setItem('user', allCustomers[i].id);
        console.log(this.customer);
        break;
      }
      else{
        this.invalidLogin = true;
        this.loggedIn = false; 
      }
    }
  }

}
