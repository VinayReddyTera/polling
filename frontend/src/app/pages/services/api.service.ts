import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,Subject,throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EncryptionService } from './encryption.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http : HttpClient,private decrypt:EncryptionService,private router:Router) { }

  private messageSource = new Subject<any>();
  message = this.messageSource.asObservable();

  private loading = new Subject<any>();
  loader = this.loading.asObservable();

  private feedback = new Subject<any>();
  givefeedback = this.feedback.asObservable();

  sendMessage(message: any) {
    this.messageSource.next(message);
  }

  initiateLoading(loader:any){
    this.loading.next(loader)
  }

  login(data : any):Observable<any>{
    return this.http.post(environment.domain+"login",data)
  }

  register(data : any):Observable<any>{
    return this.http.post(environment.domain+"register",data)
  }

  setupdata():Observable<any>{
    return this.http.get(environment.domain+"setupData")
  }

  cleardata():Observable<any>{
    return this.http.delete(environment.domain+"clearData")
  }

  fetchNominees():Observable<any>{
    return this.http.get(environment.domain+"fetchNominees")
  }

  pollNow(data:any):Observable<any>{
    return this.http.post(environment.domain+"pollNow",data)
  }

  fetchDashboardData():Observable<any>{
    return this.http.get(environment.domain+"fetchDashboardData")
  }

  isLoggedIn(){
    return this.getToken()
  }

  getRole(){
    if(localStorage.getItem('data')){
      let data:any = JSON.parse(this.decrypt.deCrypt(localStorage.getItem('data')));
      return data.role
    }
    else{
      return ''
    }
  }

  getToken() {
    if(localStorage.getItem('client-token')){
      let data = JSON.parse(this.decrypt.deCrypt(localStorage.getItem('client-token')))
      if((data.key == environment.secretKey) && (data.time>new Date())){
        return true
      }
      else{
        return false
      }
    }
    else{
      return false
    }
  }

  private handleError(err: any): Observable<never> {
    if (err.status === 403 && err.error.message === "User is not authorized to access this resource with an explicit deny") {
      localStorage.removeItem('client-token');
      localStorage.removeItem('token');
      localStorage.removeItem('data');
      this.router.navigateByUrl('account/login');
    }
    return throwError(err.statusText);
  }

}