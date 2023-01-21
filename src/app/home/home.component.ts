import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import strings from '../strings.json';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent{
  
  constructor(private router: Router){

  }

  company = strings.company;
  description = strings.description;
  faqs = strings.faqs;
  cart : string[] =  [];
  
  userLoggedIn = localStorage.getItem("user")?.toUpperCase();
  
  isLoggedIn(){
    if(this.userLoggedIn == undefined){
      return false;
    }
    return true;
  }

  login(){
    this.router.navigate(['/login']);
  }

  logOut(){
    localStorage.removeItem('user');
    window.location.reload();
  }

  addToCart(){
    if(!this.isLoggedIn()){
      this.router.navigate(['/login']);
    } else {
      if (this.cart.includes("software")){
        console.log("Adding software");
      } else {
        this.cart.push("software");
      }
    }
    
  }

}
