import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';

import { AuthRoutingModule } from './auth-routing';
import { MultiSelectModule } from 'primeng/multiselect';
import { SignupComponent } from './signup/signup.component';

@NgModule({
  declarations: [LoginComponent,SignupComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbAlertModule,
    AuthRoutingModule,
    MultiSelectModule
  ]
})
export class AuthModule { }
