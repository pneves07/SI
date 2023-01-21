import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"

import mock from '../mock.json';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{

  constructor(private router: Router) { }

  ngOnInit(): void {
      console.log(this.users);
  }

  invalidInput: boolean = false;
  duplicateInput: boolean = false;
  signedUp: boolean = false;

  users: any[] = mock.users;

  nameInput: string = "";
  emailInput: string = "";
  passwordInput: string = "";
  passwordConfirmInput: string = "";



  signup(){
   
    for(let i = 0; i < this.users.length; i++) {
      if (this.emailInput == this.users[i].email){
        this.duplicateInput = true;
      }
    }

    if (this.duplicateInput != false && this.passwordInput == this.passwordConfirmInput){
      this.users.push(this.emailInput, this.passwordInput);
      this.signedUp = true;
      this.router.navigate(['/home']);
    } else {
      this.invalidInput = true;
    }

  }
  

}
