import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT, ViewportScroller } from '@angular/common';
import { EncryptionService } from 'src/app/pages/services/encryption.service';
import { ApiService } from 'src/app/pages/services/api.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})

export class TopbarComponent implements OnInit {

  element:any;
  name : any;
  role:any;
  constructor(@Inject(DOCUMENT) private document: any, private router: Router,private decrypt:EncryptionService,private viewScroller: ViewportScroller,private apiService : ApiService) {
  }
  openMobileMenu: any;
  notificationData:any;
  loading:boolean = false;
  @Output() mobileMenuButtonClicked = new EventEmitter();

  ngOnInit() {
    let data = JSON.parse(this.decrypt.deCrypt(localStorage.getItem('data')));
    this.name = data.name;
    this.role = data.role;
    this.openMobileMenu = false;
    this.element = document.documentElement;
  }

  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  logout() {
    localStorage.removeItem('client-token');
    localStorage.removeItem('token');
    localStorage.removeItem('data');
    this.router.navigate(['/poll']);
  }

  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement && !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }

}
