import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { ComponentService } from '../../services/component.service'
import { CategoryService } from '../../services/category.service'
import { SupplierService } from '../../services/supplier.service'
import { Component as ComponentModel } from '../../models/component.model'
import { Category } from '../../models/category.model'
import { Supplier } from '../../models/supplier.model'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-component-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">รายการชิ้นส่วน</h1>
        <a routerLink="/components/create" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
          เพิ่มชิ้นส่วนใหม่
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
              placeholder="ค้นหาตามชื่อหรือรหัสชิ้นส่วน" 
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
            <label class="block text-sm font-medium text-gray-700 mb-1">กรองตามผู้จัดจำหน่าย</label>
            <select 
              [(ngModel)]="selectedSupplierId" 
              (change)="applyFilters()"
              class="w-full p-2 border rounded"
            >
              <option [value]="0">ทั้งหมด</option>
              <option *ngFor="let supplier of suppliers" [value]="supplier.id">
                {{ supplier.name }}
              </option>
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
                <th class="py-3 px-4 text-left">รหัสชิ้นส่วน</th>
                <th class="py-3 px-4 text-left">หมวดหมู่</th>
                <th class="py-3 px-4 text-left">ผู้จัดจำหน่าย</th>
                <th class="py-3 px-4 text-left">ราคา</th>
                <th class="py-3 px-4 text-left">จำนวนคงเหลือ</th>
                <th class="py-3 px-4 text-left">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let component of filteredComponents" class="border-b hover:bg-gray-50">
                <td class="py-3 px-4">{{ component.name }}</td>
                <td class="py-3 px-4">{{ component.partNumber }}</td>
                <td class="py-3 px-4">{{ component.categoryName || '-' }}</td>
                <td class="py-3 px-4">{{ component.supplierName || '-' }}</td>
                <td class="py-3 px-4">{{ component.price | currency:'THB':'symbol':'1.2-2' }}</td>
                <td class="py-3 px-4">
                  <span [ngClass]="{
                    'text-red-500': component.stockQuantity < component.minimumStock,
                    'text-yellow-500': component.stockQuantity >= component.minimumStock && component.stockQuantity <= component.minimumStock * 2,
                    'text-green-500': component.stockQuantity > component.minimumStock * 2
                  }">
                    {{ component.stockQuantity }} {{ component.unitOfMeasureAbbreviation || 'ชิ้น' }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <div class="flex space-x-2">
                    <a [routerLink]="['/components', component.id]" class="text-blue-500 hover:underline">ดู</a>
                    <a [routerLink]="['/components/edit', component.id]" class="text-green-500 hover:underline">แก้ไข</a>
                    <button (click)="deleteComponent(component.id)" class="text-red-500 hover:underline">ลบ</button>
                  </div>
                </td>
              </tr>
              
              <tr *ngIf="filteredComponents.length === 0">
                <td colspan="7" class="py-4 px-4 text-center text-gray-500">
                  ไม่พบข้อมูลชิ้นส่วน
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
export class ComponentListComponent implements OnInit {
  private componentService = inject(ComponentService)
  private categoryService = inject(CategoryService)
  private supplierService = inject(SupplierService)
  
  components: ComponentModel[] = []
  filteredComponents: ComponentModel[] = []
  categories: Category[] = []
  suppliers: Supplier[] = []
  
  searchTerm = ''
  selectedCategoryId = 0
  selectedSupplierId = 0
  
  ngOnInit(): void {
    this.loadData()
  }
  
  loadData(): void {
    this.componentService.getAllComponents().subscribe(components => {
      this.components = components
      this.filteredComponents = components
      this.applyFilters()
    })
    
    this.categoryService.getAllCategories().subscribe(categories => {
      this.categories = categories
    })
    
    this.supplierService.getAllSuppliers().subscribe(suppliers => {
      this.suppliers = suppliers
    })
  }
  
  applyFilters(): void {
    let filtered = [...this.components]
    
    // กรองตามคำค้นหา
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase()
      filtered = filtered.filter(component => 
        component.name.toLowerCase().includes(search) ||
        (component.partNumber && component.partNumber.toLowerCase().includes(search)) ||
        (component.description && component.description.toLowerCase().includes(search))
      )
    }
    
    // กรองตามหมวดหมู่
    if (this.selectedCategoryId > 0) {
      filtered = filtered.filter(component => component.categoryId === this.selectedCategoryId)
    }
    
    // กรองตามผู้จัดจำหน่าย
    if (this.selectedSupplierId > 0) {
      filtered = filtered.filter(component => component.supplierId === this.selectedSupplierId)
    }
    
    this.filteredComponents = filtered
  }
  
  deleteComponent(id: number): void {
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
        this.componentService.deleteComponent(id).subscribe(() => {
          this.components = this.components.filter(component => component.id !== id)
          this.applyFilters()
          
          Swal.fire(
            'ลบแล้ว!',
            'ข้อมูลชิ้นส่วนถูกลบเรียบร้อยแล้ว',
            'success'
          )
        })
      }
    })
  }
} 