import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AuthGuard } from 'src/app/pages/services/auth.guard';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,canActivate:[AuthGuard]
    },
    {
        path: 'register',
        component: SignupComponent,canActivate:[AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
