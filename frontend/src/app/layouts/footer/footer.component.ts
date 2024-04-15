import { Component, OnInit } from '@angular/core';
import { EncryptionService } from 'src/app/pages/services/encryption.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})

export class FooterComponent implements OnInit{

  userData:any;
  year: number = new Date().getFullYear();
  appName :any = environment.appName;
  constructor(private decrypt: EncryptionService){}

  ngOnInit(): void {
    if(localStorage.getItem('data')){
      this.userData = JSON.parse(this.decrypt.deCrypt(localStorage.getItem('data')));
    }
  }

}
