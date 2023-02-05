import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"

import getCustomers from '../api/get_customers.json';
import mock from '../mock.json';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{

  constructor(private router: Router) { }

  ngOnInit(): void {
      this.getLastId();
      console.log(this.users);
  }

  invalidInput: boolean = false;
  duplicateInput: boolean = false;
  signedUp: boolean = false;

  //users: any[] = mock.users;
  users: any[] = getCustomers.data;
  newUsers: any[] = [];
  maxId : string = "";

  nameInput = "";
  emailInput = "";
  passwordInput = "";
  passwordConfirmInput = "";

  

  inputsToText(){
    console.log("ID: " + this.maxId + " Name: " + this.nameInput + " Email: " + this.emailInput);
  }

  getLastId(){
    for (let i = 0; i < this.users.length; i++){
      if (this.users[i].id > this.maxId){
        this.maxId = this.users[i].id+1;
      }
    }
    this.maxId = this.maxId;
  }

  signup(){
    this.inputsToText();
    for(let i = 0; i < this.users.length; i++) {
      if (this.emailInput == this.users[i].email){
        this.duplicateInput = true;
      }
    }

    if (this.duplicateInput == false && this.passwordInput == this.passwordConfirmInput){   
      //this.users.unshift(this.newUser);
      //this.newUsers.push(this.newUserSimples);
      //console.log(this.newUsers);
      
      const newUser = {
        "type" : "customers",
        "id" : this.maxId,
        "attributes": {
          "tax_registration_number": "",
          "business_name": this.nameInput,
          "contact_name": "",
          "website": "",
          "phone_number": "",
          "mobile_number": "",
          "email": this.emailInput,
          "observations": "",
          "internal_observations": "",
          "not_final_customer": false,
          "cashed_vat": false,
          "tax_country_region": "PT",
          "country_iso_alpha_2": "PT",
          "saft_import_id": null,
          "is_tax_exempt": false,
          "data": {}
        },
        "relationships": {
          "addresses": { "data": [{ "type": "addresses", "id": "" }] },
          "company": { "data": { "type": "current_company", "id": "" } },
          "defaults": {
            "data": { "type": "customers_defaults", "id": "" }
          },
          "email_addresses": { "data": [] },
          "main_address": { "data": { "type": "addresses", "id": "" } },
          "main_email_address": { "data": null },
          "tax_exemption_reason": { "data": null }
        }
    
      }
      //console.log(newUser);

      localStorage.setItem("user", this.maxId);
      localStorage.setItem("userData", JSON.stringify(newUser));
      localStorage.setItem("userName", this.nameInput);
      //console.log(this.users);
      this.signedUp = true;
      this.router.navigate(['/home']);
    } else {
      this.invalidInput = true;
    }

  }

  

}
