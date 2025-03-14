import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { BOM_ROUTES } from './bom/bom.routes';
import { MACHINE_ROUTES } from './machines/machines.routes';
import { COMPONENTS_ROUTES } from './components/components.routes';
import { SUPPLIERS_ROUTES } from './suppliers/suppliers.routes';

export const routes: Routes = [
    // เส้นทางสำหรับผู้ใช้ที่ยังไม่ได้ล็อกอิน (Public Layout)
    {
        path: '',
        component: PublicLayoutComponent,
        children: [
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
            }
        ]
    },
    
    // เส้นทางสำหรับผู้ใช้ที่ล็อกอินแล้ว (Auth Layout)
    {
        path: '',
        component: AuthLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'bom',
                children: BOM_ROUTES
            },
            {
                path: 'machines',
                children: MACHINE_ROUTES
            },
            {
                path: 'components',
                children: COMPONENTS_ROUTES
            },
            {
                path: 'suppliers',
                children: SUPPLIERS_ROUTES
            }
        ]
    },
    { path: '**', redirectTo: '' }
];
