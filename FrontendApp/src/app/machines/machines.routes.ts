import { Routes } from '@angular/router'

export const MACHINE_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () => import('./machine-list/machine-list.component').then(m => m.MachineListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./machine-form/machine-form.component').then(m => m.MachineFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./machine-form/machine-form.component').then(m => m.MachineFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./machine-detail/machine-detail.component').then(m => m.MachineDetailComponent)
  }
]