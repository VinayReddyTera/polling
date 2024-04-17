import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EncryptionService } from './encryption.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private decrypt: EncryptionService, private router: Router) { }

  // Observable for sending messages
  private messageSource = new Subject<any>();
  message = this.messageSource.asObservable();

  // Observable for loading indicator
  private loading = new Subject<any>();
  loader = this.loading.asObservable();

  // Observable for feedback messages
  private feedback = new Subject<any>();
  givefeedback = this.feedback.asObservable();

  // Service to send message
  sendMessage(message: any) {
    this.messageSource.next(message);
  }

  // Service to initiate loading
  initiateLoading(loader: any) {
    this.loading.next(loader);
  }

  // Service to handle login request
  login(data: any): Observable<any> {
    return this.http.post(environment.domain + "login", data);
  }

  // Service to handle registration request
  register(data: any): Observable<any> {
    return this.http.post(environment.domain + "register", data);
  }

  // Service to fetch setup data
  setupdata(): Observable<any> {
    return this.http.get(environment.domain + "setupData").pipe(catchError(this.handleError.bind(this)));
  }

  // Service to clear or reset data
  cleardata(): Observable<any> {
    return this.http.delete(environment.domain + "clearData").pipe(catchError(this.handleError.bind(this)));
  }

  // Service to fetch nominees
  fetchNominees(): Observable<any> {
    return this.http.get(environment.domain + "fetchNominees");
  }

  // Service to poll now
  pollNow(data: any): Observable<any> {
    return this.http.post(environment.domain + "pollNow", data);
  }

  // Service to fetch dashboard data
  fetchDashboardData(): Observable<any> {
    return this.http.get(environment.domain + "fetchDashboardData").pipe(catchError(this.handleError.bind(this)));
  }

  // Service to check if user is logged in
  isLoggedIn() {
    return this.getToken();
  }

  // Service to get user role
  getRole() {
    if (localStorage.getItem('data')) {
      let data: any = JSON.parse(this.decrypt.deCrypt(localStorage.getItem('data')));
      return data.role;
    } else {
      return '';
    }
  }

  // Service to get token
  getToken() {
    if (localStorage.getItem('client-token')) {
      let data = JSON.parse(this.decrypt.deCrypt(localStorage.getItem('client-token')));
      if ((data.key == environment.secretKey) && (data.time > new Date())) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  // Service to handle error
  private handleError(err: any): Observable<never> {
    if (err.error.status === 204) {
      localStorage.clear();
      this.router.navigateByUrl('account/login');
    }
    return throwError(err.statusText);
  }

}