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
    // Initialize the login form with validators
    this.loginForm = this.fb.group({
      email:['',[Validators.required,this.validateEmail]],
      password:['',[Validators.required]]
    })
  }

  // Custom validator function for email format
  validateEmail(c:FormControl): { emailError: { message: string; }; } | null{
    const emailRegex = environment.emailRegex
    return emailRegex.test(c.value)? null : {
      emailError : {
        message : 'Invalid email format!'
      }
    }
  }

  // Toggle password visibility
  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    // Toggle input type between text and password
    if(this.showPassword){
      document.getElementById("password")?.setAttribute("type","text");
    }
    else{
      document.getElementById("password")?.setAttribute("type","password");
    }
  }

  // Function to handle login
  login() {
    this.submitted = true;
    if(this.loginForm.valid){
      // If login form is valid, initiate loading
      this.apiService.initiateLoading(true);
      this.apiService.login(this.loginForm.value).subscribe(
      (res : any)=>{
        if (res.status == 200) {
          // If login is successful
          // Clear existing tokens and data
          localStorage.removeItem('client-token');
          localStorage.removeItem('token');
          localStorage.removeItem('data');
          // Set new client token with expiry time
          let now = new Date();
          let time = now.getTime();
          let expireTime = time + 600 * 36000;
          let clientData = {
            key : environment.secretKey,
            time : expireTime
          }
          // Encrypt and store user data and client token
          let data: any = {
            name : res.data.name,
            email : res.data.email,
            role : res.data.role
          };
          localStorage.setItem('data', this.encrypt.enCrypt(JSON.stringify(data)));
          localStorage.setItem('client-token',this.encrypt.enCrypt(JSON.stringify(clientData)));
          localStorage.setItem('token',res.token);
          this.router.navigateByUrl('/dashboard');
        }
        else if (res.status == 204) {
          // If login fails due to invalid credentials or invalid username
          let msgData = {
            severity : "error",
            summary : 'Error',
            detail : res.data,
            life : 5000
          }
          this.apiService.sendMessage(msgData);
        }
      },
      (err:any)=>{
        // If an error occurs during login
        this.errorMessage = err.error
        console.log(err);
      }
    ).add(()=>{
      // After login attempt, stop loading and reset error message after 5 seconds
      this.apiService.initiateLoading(false)
      setTimeout(()=>{
        this.errorMessage = null;
      },5000)
    })
  }
  else{
    // If login form is invalid, mark the form controls as dirty
    const controls = this.loginForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            controls[name].markAsDirty()
        }
    }
  }
  }

};