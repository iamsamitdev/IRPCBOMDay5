import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { SupplierService } from '../../services/supplier.service'
import { Supplier } from '../../models/supplier.model'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">รายการผู้จัดจำหน่าย</h1>
        <a routerLink="/suppliers/create" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
          เพิ่มผู้จัดจำหน่ายใหม่
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
              placeholder="ค้นหาตามชื่อหรือข้อมูลติดต่อ" 
              class="w-full p-2 border rounded"
            >
          </div>
          
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">เรียงตาม</label>
            <select 
              [(ngModel)]="sortBy" 
              (change)="applyFilters()"
              class="w-full p-2 border rounded"
            >
              <option value="name">ชื่อ</option>
              <option value="contactPerson">ชื่อผู้ติดต่อ</option>
              <option value="email">อีเมล</option>
              <option value="phone">เบอร์โทรศัพท์</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="bg-gray-100">
                <th class="py-3 px-4 text-left">ชื่อบริษัท</th>
                <th class="py-3 px-4 text-left">ชื่อผู้ติดต่อ</th>
                <th class="py-3 px-4 text-left">อีเมล</th>
                <th class="py-3 px-4 text-left">เบอร์โทรศัพท์</th>
                <th class="py-3 px-4 text-left">ที่อยู่</th>
                <th class="py-3 px-4 text-left">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let supplier of filteredSuppliers" class="border-b hover:bg-gray-50">
                <td class="py-3 px-4">{{ supplier.name }}</td>
                <td class="py-3 px-4">{{ supplier.contactPerson || '-' }}</td>
                <td class="py-3 px-4">{{ supplier.email || '-' }}</td>
                <td class="py-3 px-4">{{ supplier.phone || '-' }}</td>
                <td class="py-3 px-4">{{ supplier.address || '-' }}</td>
                <td class="py-3 px-4">
                  <div class="flex space-x-2">
                    <a [routerLink]="['/suppliers', supplier.id]" class="text-blue-500 hover:underline">ดู</a>
                    <a [routerLink]="['/suppliers/edit', supplier.id]" class="text-green-500 hover:underline">แก้ไข</a>
                    <button (click)="deleteSupplier(supplier.id)" class="text-red-500 hover:underline">ลบ</button>
                  </div>
                </td>
              </tr>
              
              <tr *ngIf="filteredSuppliers.length === 0">
                <td colspan="6" class="py-4 px-4 text-center text-gray-500">
                  ไม่พบข้อมูลผู้จัดจำหน่าย
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
export class SupplierListComponent implements OnInit {
  private supplierService = inject(SupplierService)
  
  suppliers: Supplier[] = []
  filteredSuppliers: Supplier[] = []
  
  searchTerm = ''
  sortBy = 'name'
  
  ngOnInit(): void {
    this.loadData()
  }
  
  loadData(): void {
    this.supplierService.getAllSuppliers().subscribe(suppliers => {
      this.suppliers = suppliers
      this.filteredSuppliers = suppliers
      this.applyFilters()
    })
  }
  
  applyFilters(): void {
    let filtered = [...this.suppliers]
    
    // กรองตามคำค้นหา
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase()
      filtered = filtered.filter(supplier => 
        supplier.name.toLowerCase().includes(search) ||
        (supplier.contactPerson && supplier.contactPerson.toLowerCase().includes(search)) ||
        (supplier.email && supplier.email.toLowerCase().includes(search)) ||
        (supplier.phone && supplier.phone.toLowerCase().includes(search)) ||
        (supplier.address && supplier.address.toLowerCase().includes(search))
      )
    }
    
    // เรียงลำดับ
    filtered.sort((a, b) => {
      const valueA = (a[this.sortBy as keyof Supplier] as string) || ''
      const valueB = (b[this.sortBy as keyof Supplier] as string) || ''
      return valueA.localeCompare(valueB)
    })
    
    this.filteredSuppliers = filtered
  }
  
  deleteSupplier(id: number): void {
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
        this.supplierService.deleteSupplier(id).subscribe(() => {
          this.suppliers = this.suppliers.filter(supplier => supplier.id !== id)
          this.applyFilters()
          
          Swal.fire(
            'ลบแล้ว!',
            'ข้อมูลผู้จัดจำหน่ายถูกลบเรียบร้อยแล้ว',
            'success'
          )
        })
      }
    })
  }
} 