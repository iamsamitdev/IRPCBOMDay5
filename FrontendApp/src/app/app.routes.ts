import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    // เส้นทางสำหรับผู้ใช้ที่ยังไม่ได้ล็อกอิน (Public Layout)
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'about',
        component: AboutComponent
    },
    {
        path: 'contact',
        component: ContactComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    // เส้นทางสำหรับผู้ใช้ที่ล็อกอินแล้ว (Auth Layout)
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
    }

];
