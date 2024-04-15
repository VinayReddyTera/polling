import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';

import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/pages/services/api.service';
import { EncryptionService } from 'src/app/pages/services/encryption.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  public showPassword: boolean = false;
  loginForm : any;
  errorMessage : any;
  year: number = new Date().getFullYear();
  submitted : boolean = false;
  userData : any;
  appName:any = environment.appName
  constructor(public router: Router,
    private apiService : ApiService,private fb: FormBuilder,
    private encrypt:EncryptionService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email:['',[Validators.required,this.validateEmail]],
      password:['',[Validators.required]]
    })
  }

  validateEmail(c:FormControl): { emailError: { message: string; }; } | null{
    const emailRegex = environment.emailRegex
    return emailRegex.test(c.value)? null : {
      emailError : {
        message : 'Invalid email format!'
      }
    }
  }

    public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    if(this.showPassword){
      document.getElementById("password")?.setAttribute("type","text");
    }
    else{
      document.getElementById("password")?.setAttribute("type","password");
    }
  }

  login() {
    this.submitted = true
    if(this.loginForm.valid){
      this.apiService.initiateLoading(true);
      let payload = {
        data : this.loginForm.value
      }
      this.apiService.login(payload).subscribe(
      (res : any)=>{
        console.log(res)
        if (!res.is_error) {
          localStorage.clear();
          let now = new Date();
          let time = now.getTime();
          let expireTime = time + 600 * 36000;
          let clientData = {
            key : environment.secretKey,
            time : expireTime
          }
          let data: any = {
            first_name : res.status[0].first_name,
            last_name : res.status[0].last_name,
            email : res.status[0].email,
            boutique_id : res.status[0].boutique_id,
            employee_id : res.status[0].employee_id,
            opr_role : res.status[0].opr_role,
            boutique_short_name : this.userData.boutique_short_name,
            boutique_name : this.userData.boutique_name
          };
          localStorage.setItem('data', this.encrypt.enCrypt(JSON.stringify(data)));
          localStorage.setItem('client-token',this.encrypt.enCrypt(JSON.stringify(clientData)));
          localStorage.setItem('token',res.token);
          this.router.navigateByUrl('/dashboard');
        }
        else if (res.is_error) {
          let msgData = {
            severity : "error",
            summary : 'Error',
            detail : res.status,
            life : 5000
          }
          this.apiService.sendMessage(msgData);
        }
      },
      (err:any)=>{
        this.errorMessage = err.error
        console.log(err);
      }
    ).add(()=>{
      this.apiService.initiateLoading(false)
      setTimeout(()=>{
        this.errorMessage = null;
      },5000)
    })
  }
  else{
    const controls = this.loginForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            controls[name].markAsDirty()
        }
    }
  }
  }

}
