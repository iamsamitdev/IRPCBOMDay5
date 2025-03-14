import { Routes } from '@angular/router'

export const COMPONENTS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () => import('./component-list/component-list.component').then(m => m.ComponentListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./component-form/component-form.component').then(m => m.ComponentFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./component-form/component-form.component').then(m => m.ComponentFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./component-detail/component-detail.component').then(m => m.ComponentDetailComponent)
  }
]