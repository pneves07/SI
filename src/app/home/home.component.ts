import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import strings from '../strings.json';
import axios from 'axios';

const apiUrl = 'https://api12.toconline.pt';
const headers = {
  'Authorization': 'Bearer 12-37830-1480806-3fd18385d91422547ca504f9bf10027eba084ea486e617e3fb2211e05093b0aa',
  'Content-Type': 'application/json',
  'OAUTH_CLIENT_ID': 'pt263831205_c7469-4d753ba12ab59a59',
  'OAUTH_CLIENT_SECRET': '9d42c471a7d1d85f348116b23c0bcca6',
  'OAUTH_URL': 'https://app12.toconline.pt/oauth',             
  'API_URL': 'https://api12.toconline.pt',
  'OAUTH_REDIRECT_URL': 'https://oauth.pstmn.io/v1/callback',
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent{
  
  constructor(private router: Router){
    async function getDataFromApi() {
      try {
        const response = await axios.get(`${apiUrl}/api/customers`, {headers});
        return response.data;
      } catch (error) {
        console.error(error);
        return error;
      }
    }
    getDataFromApi().then(data => console.log(data));
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
