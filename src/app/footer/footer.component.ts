import { Component } from '@angular/core';
import strings from '../strings.json';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  company = strings.company;
  description = strings.description;

}
