import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { MachineService } from '../../services/machine.service'
import { CategoryService } from '../../services/category.service'
import { Machine } from '../../models/machine.model'
import { Category } from '../../models/category.model'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-machine-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">รายการเครื่องจักร</h1>
        <a routerLink="/machines/create" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
          เพิ่มเครื่องจักรใหม่
        </a>
      </div>
      
      <div class="bg-white p-4 rounded shadow mb-6">
        <div class="flex flex-col md:flex-row gap-4 mb-4">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">ค้นหา</label>
            <input 
              type="text" 
              [(ngModel)]="searchTerm" 
              (input)="applyFilters()"
              placeholder="ค้นหาตามชื่อหรือรุ่น" 
              class="w-full p-2 border rounded"
            >
          </div>
          
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">กรองตามหมวดหมู่</label>
            <select 
              [(ngModel)]="selectedCategoryId" 
              (change)="applyFilters()"
              class="w-full p-2 border rounded"
            >
              <option [value]="0">ทั้งหมด</option>
              <option *ngFor="let category of categories" [value]="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
          
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">เรียงตาม</label>
            <select 
              [(ngModel)]="sortBy" 
              (change)="applyFilters()"
              class="w-full p-2 border rounded"
            >
              <option value="name">ชื่อ</option>
              <option value="modelNumber">รุ่น</option>
              <option value="manufacturer">ผู้ผลิต</option>
              <option value="purchaseDate">วันที่ซื้อ</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="bg-gray-100">
                <th class="py-3 px-4 text-left">ชื่อ</th>
                <th class="py-3 px-4 text-left">รุ่น</th>
                <th class="py-3 px-4 text-left">ผู้ผลิต</th>
                <th class="py-3 px-4 text-left">หมวดหมู่</th>
                <th class="py-3 px-4 text-left">วันที่ซื้อ</th>
                <th class="py-3 px-4 text-left">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let machine of filteredMachines" class="border-b hover:bg-gray-50">
                <td class="py-3 px-4">{{ machine.name }}</td>
                <td class="py-3 px-4">{{ machine.modelNumber }}</td>
                <td class="py-3 px-4">{{ machine.manufacturer || '-' }}</td>
                <td class="py-3 px-4">{{ machine.categoryName || '-' }}</td>
                <td class="py-3 px-4">{{ machine.purchaseDate ? (machine.purchaseDate | date:'dd/MM/yyyy') : '-' }}</td>
                <td class="py-3 px-4">
                  <div class="flex space-x-2">
                    <a [routerLink]="['/machines', machine.id]" class="text-blue-500 hover:underline">ดู</a>
                    <a [routerLink]="['/machines/edit', machine.id]" class="text-green-500 hover:underline">แก้ไข</a>
                    <button (click)="deleteMachine(machine.id)" class="text-red-500 hover:underline">ลบ</button>
                  </div>
                </td>
              </tr>
              
              <tr *ngIf="filteredMachines.length === 0">
                <td colspan="6" class="py-4 px-4 text-center text-gray-500">
                  ไม่พบข้อมูลเครื่องจักร
                </td>
              </tr>
            </tbody>
          </table>
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
export class MachineListComponent implements OnInit {
  private machineService = inject(MachineService)
  private categoryService = inject(CategoryService)
  
  machines: Machine[] = []
  filteredMachines: Machine[] = []
  categories: Category[] = []
  
  searchTerm = ''
  selectedCategoryId = 0
  sortBy = 'name'
  
  ngOnInit(): void {
    this.loadData()
  }
  
  loadData(): void {
    this.machineService.getAllMachines().subscribe(machines => {
      this.machines = machines
      this.filteredMachines = machines
      this.applyFilters()
    })
    
    this.categoryService.getAllCategories().subscribe(categories => {
      this.categories = categories
    })
  }
  
  applyFilters(): void {
    let filtered = [...this.machines]
    
    // กรองตามคำค้นหา
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase()
      filtered = filtered.filter(machine => 
        machine.name.toLowerCase().includes(search) ||
        (machine.modelNumber && machine.modelNumber.toLowerCase().includes(search)) ||
        (machine.manufacturer && machine.manufacturer.toLowerCase().includes(search))
      )
    }
    
    // กรองตามหมวดหมู่
    if (this.selectedCategoryId > 0) {
      filtered = filtered.filter(machine => machine.categoryId === this.selectedCategoryId)
    }
    
    // เรียงลำดับ
    filtered.sort((a, b) => {
      const valueA = a[this.sortBy] || ''
      const valueB = b[this.sortBy] || ''
      
      if (this.sortBy === 'purchaseDate') {
        return new Date(valueB).getTime() - new Date(valueA).getTime()
      }
      
      return valueA.localeCompare(valueB)
    })
    
    this.filteredMachines = filtered
  }
  
  deleteMachine(id: number): void {
    Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: "การลบข้อมูลนี้ไม่สามารถเรียกคืนได้!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.machineService.deleteMachine(id).subscribe(() => {
          this.machines = this.machines.filter(machine => machine.id !== id)
          this.applyFilters()
          
          Swal.fire(
            'ลบแล้ว!',
            'ข้อมูลเครื่องจักรถูกลบเรียบร้อยแล้ว',
            'success'
          )
        })
      }
    })
  }
} 