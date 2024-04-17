import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: ApiService, private router: Router) {}

  // Define redirection URLs for different roles
  redirect: any = {
    'admin': '/dashboard',
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Get the user role
    let userRole: any = this.authService.getRole();
    // Define roles that have access to certain routes
    let roles = ['admin'];
    
    // Remove tokens if user's role doesn't match the roles with access
    if (!roles.includes(userRole)) {
      localStorage.removeItem('client-token');
      localStorage.removeItem('token');
      localStorage.removeItem('data');
    }
    
    // Check if user is logged in
    if (this.authService.isLoggedIn() == true) {
      // If logged in, handle access based on user role
      if (route.routeConfig?.path === 'login' || route.routeConfig?.path === 'register') {
        // If user is trying to access login or register page while logged in, redirect to dashboard
        this.router.navigateByUrl('/dashboard');
        return false;
      } else {
        // If user is logged in and trying to access other pages, check user role for redirection
        let role: any = this.authService.getRole();
        if (role == 'admin') {
          // If user is an admin, allow access to dashboard and redirect to dashboard if trying to access other pages
          if (route.routeConfig?.path === 'dashboard') {
            return true;
          } else {
            // Redirect to admin's dashboard if trying to access other pages
            console.log(`Redirecting to ${this.redirect[role]}`);
            this.router.navigateByUrl(this.redirect[role]);
          }
          return false;
        } else {
          // If user is not an admin, remove tokens and redirect to poll page
          localStorage.removeItem('client-token');
          localStorage.removeItem('token');
          localStorage.removeItem('data');
          this.router.navigateByUrl('/poll');
          return false;
        }
      }
    } else {
      // If user is not logged in, handle access to routes
      if (route.routeConfig?.path === 'login' || route.routeConfig?.path === 'register') {
        // Allow access to login and register pages for non-logged in users
        return true;
      } else {
        // Redirect non-logged in users to poll page if they try to access other pages
        this.router.navigateByUrl('/poll');
        return false;
      }
    }
  }
}