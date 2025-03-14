import { Routes } from '@angular/router'
import { BomListComponent } from './bom-list/bom-list.component'
import { BomDetailComponent } from './bom-detail/bom-detail.component'
import { BomFormComponent } from './bom-form/bom-form.component'
import { BomTreeComponent } from './bom-tree/bom-tree.component'

export const BOM_ROUTES: Routes = [
  {
    path: '',
    component: BomListComponent
  },
  {
    path: 'tree',
    component: BomTreeComponent
  },
  {
    path: 'create',
    component: BomFormComponent
  },
  {
    path: 'edit/:id',
    component: BomFormComponent
  },
  {
    path: ':id',
    component: BomDetailComponent
  }
] 