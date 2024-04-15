import { Component,OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {

  feedbackForm:any;
  showFeedback:boolean = false;
  title:any;

  constructor(public router: Router) {
  }

  ngOnInit() {
  }

}
