import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Router } from '@angular/router'
import { MachineService } from '../services/machine.service'
import { ComponentService } from '../services/component.service'
import { BomService } from '../services/bom.service'
import { Machine } from '../models/machine.model'
import { Component as ComponentModel } from '../models/component.model'
import { BillOfMaterial } from '../models/bom.model'

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-6">แผงควบคุมระบบ BOM</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow cursor-pointer" (click)="navigateTo('/machines')">
          <h2 class="text-lg font-semibold mb-2">เครื่องจักรทั้งหมด</h2>
          <p class="text-3xl font-bold">{{ machines.length }}</p>
        </div>
        
        <div class="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow cursor-pointer" (click)="navigateTo('/components')">
          <h2 class="text-lg font-semibold mb-2">ชิ้นส่วนทั้งหมด</h2>
          <p class="text-3xl font-bold">{{ components.length }}</p>
        </div>
        
        <div class="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow cursor-pointer" (click)="navigateTo('/bom')">
          <h2 class="text-lg font-semibold mb-2">รายการ BOM ทั้งหมด</h2>
          <p class="text-3xl font-bold">{{ boms.length }}</p>
        </div>
        
        <div class="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow cursor-pointer" (click)="navigateTo('/components', { filter: 'lowStock' })">
          <h2 class="text-lg font-semibold mb-2">ชิ้นส่วนที่ต้องสั่งซื้อ</h2>
          <p class="text-3xl font-bold">{{ getLowStockComponents() }}</p>
        </div>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white p-4 rounded shadow">
          <h2 class="text-xl font-semibold mb-4">เครื่องจักรล่าสุด</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="bg-gray-100">
                  <th class="py-2 px-4 text-left">ชื่อ</th>
                  <th class="py-2 px-4 text-left">รุ่น</th>
                  <th class="py-2 px-4 text-left">ผู้ผลิต</th>
                  <th class="py-2 px-4 text-left">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let machine of machines.slice(0, 10)" class="border-b hover:bg-gray-50 cursor-pointer" (click)="navigateTo('/machines/' + machine.id)">
                  <td class="py-2 px-4">{{ machine.name }}</td>
                  <td class="py-2 px-4">{{ machine.modelNumber }}</td>
                  <td class="py-2 px-4">{{ machine.manufacturer || '-' }}</td>
                  <td class="py-2 px-4">
                    <a [routerLink]="['/machines', machine.id]" class="text-blue-500 hover:underline">ดูรายละเอียด</a>
                  </td>
                </tr>
                <tr *ngIf="machines.length === 0">
                  <td colspan="4" class="py-4 text-center text-gray-500">ไม่พบข้อมูลเครื่องจักร</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mt-4 text-right">
            <a routerLink="/machines" class="text-blue-500 hover:underline">ดูทั้งหมด</a>
          </div>
        </div>
        
        <div class="bg-white p-4 rounded shadow">
          <h2 class="text-xl font-semibold mb-4">ชิ้นส่วนล่าสุด</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="bg-gray-100">
                  <th class="py-2 px-4 text-left">ชื่อ</th>
                  <th class="py-2 px-4 text-left">รหัส</th>
                  <th class="py-2 px-4 text-left">ราคา</th>
                  <th class="py-2 px-4 text-left">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let component of components.slice(0, 10)" class="border-b hover:bg-gray-50 cursor-pointer" (click)="navigateTo('/components/' + component.id)">
                  <td class="py-2 px-4">{{ component.name }}</td>
                  <td class="py-2 px-4">{{ component.partNumber }}</td>
                  <td class="py-2 px-4">{{ component.price | currency:'THB':'symbol':'1.2-2' }}</td>
                  <td class="py-2 px-4">
                    <a [routerLink]="['/components', component.id]" class="text-blue-500 hover:underline">ดูรายละเอียด</a>
                  </td>
                </tr>
                <tr *ngIf="components.length === 0">
                  <td colspan="4" class="py-4 text-center text-gray-500">ไม่พบข้อมูลชิ้นส่วน</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mt-4 text-right">
            <a routerLink="/components" class="text-blue-500 hover:underline">ดูทั้งหมด</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class DashboardComponent implements OnInit {
  private machineService = inject(MachineService)
  private componentService = inject(ComponentService)
  private bomService = inject(BomService)
  private router = inject(Router)
  
  machines: Machine[] = []
  components: ComponentModel[] = []
  boms: BillOfMaterial[] = []
  
  ngOnInit(): void {
    this.loadData()
  }
  
  loadData(): void {
    this.machineService.getAllMachines().subscribe(machines => {
      this.machines = machines
    })
    
    this.componentService.getAllComponents().subscribe(components => {
      this.components = components
    })
    
    this.bomService.getAllBoms().subscribe(boms => {
      this.boms = boms
    })
  }
  
  getLowStockComponents(): number {
    return this.components.filter(c => c.minimumStock > 0).length
  }
  
  navigateTo(path: string, queryParams?: any): void {
    if (queryParams) {
      this.router.navigate([path], { queryParams })
    } else {
      this.router.navigate([path])
    }
  }
} 