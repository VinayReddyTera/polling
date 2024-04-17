import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authservice : ApiService, private router : Router){
  }

  redirect : any = 
    {
      'admin' : '/dashboard',
    }

  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let userRole : any = this.authservice.getRole();
    let roles = ['admin'];
    if(!roles.includes(userRole)){
      localStorage.removeItem('client-token');
      localStorage.removeItem('token');
      localStorage.removeItem('data');
    }
    if(this.authservice.isLoggedIn() == true){
      if (route.routeConfig?.path === 'login' || route.routeConfig?.path === 'register') {
        this.router.navigateByUrl('/dashboard')
        return false;
      } else {
        let role : any = this.authservice.getRole();
        // console.log(route.data['role'])
        // console.log(role)
        if(role == 'admin'){
          if(route.routeConfig?.path === 'dashboard'){
            return true
          }
          else{
            console.log(`redirecting to ${this.redirect[role]}`)
            this.router.navigateByUrl(this.redirect[role])
          }
          return false
        }
        else{
          localStorage.removeItem('client-token');
          localStorage.removeItem('token');
          localStorage.removeItem('data');
          this.router.navigateByUrl('/poll')
          return false
        }
      }
    }
    else {
      if (route.routeConfig?.path === 'login' || route.routeConfig?.path === 'register') {
        return true;
      } else {
        this.router.navigateByUrl('/poll')
        return false;
      }
    }
  }
  
}