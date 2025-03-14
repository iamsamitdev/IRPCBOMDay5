import { Routes } from '@angular/router'

export const SUPPLIERS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () => import('./supplier-list/supplier-list.component').then(m => m.SupplierListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./supplier-form/supplier-form.component').then(m => m.SupplierFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./supplier-form/supplier-form.component').then(m => m.SupplierFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./supplier-detail/supplier-detail.component').then(m => m.SupplierDetailComponent)
  }
]