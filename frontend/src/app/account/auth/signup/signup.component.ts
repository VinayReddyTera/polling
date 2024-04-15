import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/pages/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm:any;
  submitted = false;
  error = '';
  successmsg = false;
  successMessage:any;
  errorMessage:any;
  showPassword: boolean = false;
  showConfirmPassword : boolean = false;
  year: number = new Date().getFullYear();
  
  constructor(private formBuilder: FormBuilder,
     private router: Router,private apiService:ApiService) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required,this.validateEmail]],
      password: ['', [Validators.required]],
      cPassword: ['', [Validators.required]]
    },{validator : this.validatePassword});

  }

  validateEmail(c:FormControl): { emailError: { message: string; }; } | null{
    const emailRegex = environment.emailRegex
    return emailRegex.test(c.value)? null : {
      emailError : {
        message : 'Invalid email format!'
      }
    }
  }

  validateName(c:FormControl): { nameError: { message: string; }; } | null{
    const nameRegex = environment.nameRegex
    return nameRegex.test(c.value)? null : {
      nameError : {
        message : 'Invalid Name format!'
      }
    }
  }
  
validatePassword(c:FormGroup){
  if(c.controls['password'].value == c.controls['cPassword'].value){
    return null
  }
  else{
    return {
      passwordError : {
        message : "Passwords Didn't Match!"
      }
    }
  }
}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    if(this.showPassword){
      document.getElementById("password")?.setAttribute("type","text");
    }
    else{
      document.getElementById("password")?.setAttribute("type","password");
    }
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
    if(this.showConfirmPassword){
      document.getElementById("cPassword")?.setAttribute("type","text");
    }
    else{
      document.getElementById("cPassword")?.setAttribute("type","password");
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  onSubmit() {
    this.submitted = true;
    console.log(this.signupForm.value);
    if(this.signupForm.valid){
      this.apiService.initiateLoading(true)
      this.apiService.register(this.signupForm.value).subscribe(
        (res:any)=>{
          if(res.status == 200){
            this.signupForm.reset();
            this.successMessage = res.data;
            let msgData = {
              severity : "success",
              summary : 'Success',
              detail : res.data,
              life : 5000
            }
            this.apiService.sendMessage(msgData);
            this.router.navigateByUrl('/account/login')
          }
          else if(res.status == 204){
            this.errorMessage = res.data;
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
          console.log(err)
        }
      ).add(()=>{
        this.apiService.initiateLoading(false)
        setTimeout(()=>{
          this.successMessage = null;
          this.errorMessage = null;
        },4000)
      })
    }
  }

}
