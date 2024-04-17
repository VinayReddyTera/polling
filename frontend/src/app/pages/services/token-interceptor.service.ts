import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor() { }

  // Intercept method to intercept HTTP requests and add authorization token
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the token from local storage
    let token: any = localStorage.getItem('token');
    // If token is not available, set it as empty string
    if (!token) {
      token = '';
    }
    // Clone the request and set the authorization header with the token
    const tokenizedReq = req.clone({
      setHeaders: {
        Authorization: token
      }
    });
    // Forward the modified request to the next interceptor or to the backend
    return next.handle(tokenizedReq);
  }
}