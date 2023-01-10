import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder, Validators } from "@angular/forms";


import mock from '../mock.json';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email = mock.emailSuccess;
  


  loginForm = new FormGroup({
    email: new FormControl('a'),
    password: new FormControl(''),
  });

}
