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
    // Initialize the signup form with validators
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required], // Name field with required validator
      email: ['', [Validators.required,this.validateEmail]], // Email field with required validator and custom email validator
      password: ['', [Validators.required]], // Password field with required validator
      cPassword: ['', [Validators.required]] // Confirm password field with required validator
    },{validator : this.validatePassword}); // Custom validator for matching passwords

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

  // Custom validator function for name format
  validateName(c:FormControl): { nameError: { message: string; }; } | null{
    const nameRegex = environment.nameRegex
    return nameRegex.test(c.value)? null : {
      nameError : {
        message : 'Invalid Name format!'
      }
    }
  }
  
  // Custom validator function for matching passwords
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

  // Toggle password visibility
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    if(this.showPassword){
      document.getElementById("password")?.setAttribute("type","text");
    }
    else{
      document.getElementById("password")?.setAttribute("type","password");
    }
  }

  // Toggle confirm password visibility
  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
    if(this.showConfirmPassword){
      document.getElementById("cPassword")?.setAttribute("type","text");
    }
    else{
      document.getElementById("cPassword")?.setAttribute("type","password");
    }
  }

  // Convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  // Function to handle form submission
  onSubmit() {
    this.submitted = true;
    if(this.signupForm.valid){
      // If form is valid, initiate loading
      this.apiService.initiateLoading(true)
      // Send registration request to API
      this.apiService.register(this.signupForm.value).subscribe(
        (res:any)=>{
          if(res.status == 200){
            // If registration is successful
            this.signupForm.reset(); // Reset form
            this.successMessage = res.data; // Set success message
            // Send success message to user
            let msgData = {
              severity : "success",
              summary : 'Success',
              detail : res.data,
              life : 5000
            }
            this.apiService.sendMessage(msgData);
            // Redirect to login page
            this.router.navigateByUrl('/account/login')
          }
          else if(res.status == 204){
            // If registration fails due to existing email
            this.errorMessage = res.data; // Set error message
            // Send error message to user
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
          console.log(err) // Log error to console
        }
      ).add(()=>{
        // After registration attempt, stop loading and reset success and error messages after 4 seconds
        this.apiService.initiateLoading(false)
        setTimeout(()=>{
          this.successMessage = null;
          this.errorMessage = null;
        },4000)
      })
    }
  }

}