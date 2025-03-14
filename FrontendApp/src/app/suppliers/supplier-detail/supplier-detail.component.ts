import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, ActivatedRoute, Router } from '@angular/router'
import { SupplierService } from '../../services/supplier.service'
import { Supplier } from '../../models/supplier.model'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-supplier-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-4">
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-800">รายละเอียดซัพพลายเออร์</h1>
            <div class="flex space-x-2">
              <a [routerLink]="['/suppliers/edit', supplier?.id]" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                แก้ไข
              </a>
              <button (click)="deleteSupplier()" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
                ลบ
              </button>
              <a routerLink="/suppliers" class="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded">
                กลับ
              </a>
            </div>
          </div>
          
          <div *ngIf="loading" class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          
          <div *ngIf="!loading && supplier" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div class="mb-6">
                <h2 class="text-lg font-semibold text-gray-700 mb-2">ข้อมูลบริษัท</h2>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="mb-4">
                    <p class="text-sm text-gray-500">ชื่อบริษัท</p>
                    <p class="text-lg">{{ supplier.name }}</p>
                  </div>
                  <div class="mb-4">
                    <p class="text-sm text-gray-500">ที่อยู่</p>
                    <p class="whitespace-pre-line">{{ supplier.address || '-' }}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 class="text-lg font-semibold text-gray-700 mb-2">หมายเหตุ</h2>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="whitespace-pre-line">{{ supplier.notes || 'ไม่มีหมายเหตุ' }}</p>
                </div>
              </div>
            </div>
            
            <div>
              <div class="mb-6">
                <h2 class="text-lg font-semibold text-gray-700 mb-2">ข้อมูลติดต่อ</h2>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="mb-4">
                    <p class="text-sm text-gray-500">ผู้ติดต่อ</p>
                    <p class="text-lg">{{ supplier.contactPerson || '-' }}</p>
                  </div>
                  <div class="mb-4">
                    <p class="text-sm text-gray-500">อีเมล</p>
                    <p class="text-lg">
                      <a *ngIf="supplier.email" [href]="'mailto:' + supplier.email" class="text-blue-500 hover:underline">
                        {{ supplier.email }}
                      </a>
                      <span *ngIf="!supplier.email">-</span>
                    </p>
                  </div>
                  <div class="mb-4">
                    <p class="text-sm text-gray-500">โทรศัพท์</p>
                    <p class="text-lg">
                      <a *ngIf="supplier.phone" [href]="'tel:' + supplier.phone" class="text-blue-500 hover:underline">
                        {{ supplier.phone }}
                      </a>
                      <span *ngIf="!supplier.phone">-</span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 class="text-lg font-semibold text-gray-700 mb-2">ข้อมูลเพิ่มเติม</h2>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="mb-4">
                    <p class="text-sm text-gray-500">วันที่สร้าง</p>
                    <p class="text-lg">{{ supplier.createdAt | date:'dd/MM/yyyy HH:mm' }}</p>
                  </div>
                  <div class="mb-4">
                    <p class="text-sm text-gray-500">อัปเดตล่าสุด</p>
                    <p class="text-lg">{{ supplier.updatedAt | date:'dd/MM/yyyy HH:mm' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div *ngIf="!loading && !supplier" class="py-8 text-center">
            <p class="text-lg text-gray-500">ไม่พบข้อมูลซัพพลายเออร์</p>
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
export class SupplierDetailComponent implements OnInit {
  private supplierService = inject(SupplierService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  
  supplier: Supplier | null = null
  loading = true
  
  ngOnInit(): void {
    this.loadSupplier()
  }
  
  loadSupplier(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    if (id) {
      this.supplierService.getSupplierById(id).subscribe({
        next: (supplier) => {
          this.supplier = supplier
          this.loading = false
        },
        error: (error) => {
          console.error('Error loading supplier:', error)
          this.loading = false
          Swal.fire({
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่สามารถโหลดข้อมูลซัพพลายเออร์ได้',
            icon: 'error',
            confirmButtonText: 'ตกลง'
          })
        }
      })
    } else {
      this.loading = false
    }
  }
  
  deleteSupplier(): void {
    if (!this.supplier) return
    
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
        this.supplierService.deleteSupplier(this.supplier!.id).subscribe({
          next: () => {
            Swal.fire(
              'ลบแล้ว!',
              'ข้อมูลซัพพลายเออร์ถูกลบเรียบร้อยแล้ว',
              'success'
            )
            this.router.navigate(['/suppliers'])
          },
          error: (error) => {
            console.error('Error deleting supplier:', error)
            Swal.fire({
              title: 'เกิดข้อผิดพลาด',
              text: 'ไม่สามารถลบข้อมูลซัพพลายเออร์ได้',
              icon: 'error',
              confirmButtonText: 'ตกลง'
            })
          }
        })
      }
    })
  }
} 