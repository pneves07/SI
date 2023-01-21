import { Component } from '@angular/core';
import { Router } from "@angular/router";
import strings from '../strings.json';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  company = strings.company;
  description = strings.description;
  cart = [];


  constructor(private router: Router) { }

  logOut(){
    this.router.navigate(['/login']);
  }

}
