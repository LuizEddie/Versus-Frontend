import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { ConfirmNewPasswordComponent } from './pages/auth/confirm-new-password/confirm-new-password.component';
import { ConfirmRegisterComponent } from './pages/auth/confirm-register/confirm-register.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    {
        path: 'auth',
        component: AuthLayoutComponent,
        children: [
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'forgot-password',
                component: ForgotPasswordComponent
            },
            {
                path: 'register',
                component: RegisterComponent
            },
            {
                path: 'confirm-new-password',
                component: ConfirmNewPasswordComponent    
            },
            {
                path: 'confirm-register',
                component: ConfirmRegisterComponent
            },
            {
                path: '',
                redirectTo: 'login', 
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];
