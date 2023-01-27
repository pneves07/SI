import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import strings from '../strings.json';
import { HttpClient } from '@angular/common/http';
import getCustomers from '../api/get_customers.json';
import getProducts from '../api/get_products.json';


//import { Customer } from '../models/customer.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  constructor(private router: Router, private http: HttpClient){
  }

  ngOnInit(): void {
    this.getCustomer();
  }
  

  company = strings.company;
  description = strings.description;
  faqs = strings.faqs;
  customer : object = {};
  customerName: string = "";
  productId : string = getProducts.data[0].id;
  productPrice : number = getProducts.data[0].attributes.sales_price;

  
  userLoggedIn = localStorage.getItem("user")?.toUpperCase();

  getCustomer(){
    for (let i = 0; i < getCustomers.data.length; i++){
      if (getCustomers.data[i].id === this.userLoggedIn){
        this.customer = getCustomers.data[i];
        this.customerName = getCustomers.data[i].attributes.business_name;
        //console.log("Cliente autenticado: " + JSON.stringify(this.customer));
      }
    }
  }

  /*
  getCustomersAPI(){
    this.http.get('https://api12.toconline.pt/api/customers', { 
      headers: { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer 12-37830-1480806-b681abcf35d3334234814d7e8e55bc2c7acecc59dc7bd6d737b368cfbd94110f',
        'client_id': 'pt999999990_c37830-b4141235cbe6dd18',
        'client_secret': '902deb1fa379ed63c2e7125bf52100e6',
        'base_url_oauth': 'https://app12.toconline.pt/oauth',
        'base_url': 'https://api12.toconline.pt',
        'redirect_uri_oauth': 'https://oauth.pstmn.io/v1/callback'
      }}).subscribe(data => {
        console.log(data);
      }
    );
  }
  */

  checkout(){
    if (this.isLoggedIn()){
      this.router.navigate(['/checkout']);
    } else {
      this.router.navigate(['/login']);
    }
  }

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


}
