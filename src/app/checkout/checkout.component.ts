import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { refPayment } from '../models/refPayment.model';
import getProducts from '../api/get_products.json';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {

  constructor(private router: Router){
  }

  distritos = [
    'Aveiro',
    'Beja',
    'Braga',
    'Bragança',
    'Castelo Branco',
    'Coimbra',
    'Évora',
    'Faro',
    'Guarda',
    'Leiria',
    'Lisboa',
    'Portalegre',
    'Porto',
    'Santarém',
    'Setúbal',
    'Viana do Castelo',
    'Vila Real',
    'Viseu',
    'Ilha da Madeira',
    'Ilha de Porto Santo',
    'Ilha de Santa Maria',
    'Ilha de São Miguel',
    'Ilha Terceira',
    'Ilha da Graciosa',
    'Ilha de São Jorge',
    'Ilha do Pico',
    'Ilha do Faial',
    'Ilha das Flores',
    'Ilha do Corvo'
  ];

  dadosGerados : boolean = false;
  novaTentativa : boolean = false;
  dadosIncompletos : boolean = false;


  refPayment : refPayment = {
    entity: 0,
    ref: 0,
    value: 0
  };

  dadosPessoais = {
    pNome : "",
    uNome : "",
    email : "",
    morada : "",
    morada2 : "",
    pais : "",
    distrito : "",
    cPostal : "",
    codPremium : ""
  }

  saveData = (function () {
    let a = document.createElement("a");
    document.body.appendChild(a);
    return function (data : any, fileName : string) {
        var json = JSON.stringify(data),
            blob = new Blob([json], {type: "octet/stream"}),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };
  }());

  guardarRef(){
    let dataToFile =  "Entidade: " +  this.refPayment.entity + " Referência: " + this.refPayment.ref + " Valor: " + this.refPayment.value;
    this.saveData(dataToFile, "Dados_para_pagamento.txt");
    this.router.navigate(['/home']);
  }

  randomIntFromInterval(min: number, max : number) { 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  
  generateReference(){
    if (this.dadosGerados == false){
      if(
        this.dadosPessoais.pNome == ""    || 
        this.dadosPessoais.uNome == ""    || 
        this.dadosPessoais.email == ""    || 
        this.dadosPessoais.morada == ""   || 
        this.dadosPessoais.pais == ""     || 
        this.dadosPessoais.distrito == "" || 
        this.dadosPessoais.cPostal == "")
      {
        this.dadosIncompletos = true;
      }
      else {
        this.dadosGerados = true;
        this.refPayment.entity = 12345;
        this.refPayment.ref = this.randomIntFromInterval(100000000, 999999999);
        this.refPayment.value = getProducts.data[0].attributes.sales_price;
        this.dadosIncompletos = false;
      }
    }
    else{
      this.novaTentativa = true; 
    }
  }
            
        
    
}

