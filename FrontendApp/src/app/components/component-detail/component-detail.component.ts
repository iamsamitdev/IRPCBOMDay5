import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, ActivatedRoute, Router } from '@angular/router'
import { ComponentService } from '../../services/component.service'
import { Component as ComponentModel } from '../../models/component.model'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-component-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-4">
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-800">รายละเอียดชิ้นส่วน</h1>
            <div class="flex space-x-2">
              <a [routerLink]="['/components/edit', component?.id]" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                แก้ไข
              </a>
              <button (click)="deleteComponent()" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
                ลบ
              </button>
              <a routerLink="/components" class="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded">
                กลับ
              </a>
            </div>
          </div>
          
          <div *ngIf="loading" class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          
          <div *ngIf="!loading && component" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div class="mb-6">
                <h2 class="text-lg font-semibold text-gray-700 mb-2">ข้อมูลทั่วไป</h2>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="mb-4">
                    <p class="text-sm text-gray-500">ชื่อชิ้นส่วน</p>
                    <p class="text-lg">{{ component.name }}</p>
                  </div>
                  <div class="mb-4">
                    <p class="text-sm text-gray-500">รหัสชิ้นส่วน</p>
                    <p class="text-lg">{{ component.partNumber }}</p>
                  </div>
                  <div class="mb-4">
                    <p class="text-sm text-gray-500">หมวดหมู่</p>
                    <p class="text-lg">{{ component.categoryName || '-' }}</p>
                  </div>
                  <div class="mb-4">
                    <p class="text-sm text-gray-500">ผู้จัดจำหน่าย</p>
                    <p class="text-lg">{{ component.supplierName || '-' }}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 class="text-lg font-semibold text-gray-700 mb-2">รายละเอียด</h2>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="whitespace-pre-line">{{ component.description || 'ไม่มีรายละเอียด' }}</p>
                </div>
              </div>
            </div>
            
            <div>
              <div class="mb-6">
                <h2 class="text-lg font-semibold text-gray-700 mb-2">ข้อมูลสต็อก</h2>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="mb-4">
                    <p class="text-sm text-gray-500">ราคา</p>
                    <p class="text-lg">{{ component.price | currency:'THB':'symbol':'1.2-2' }}</p>
                  </div>
                  <div class="mb-4">
                    <p class="text-sm text-gray-500">จำนวนคงเหลือ</p>
                    <p class="text-lg" [ngClass]="{
                      'text-red-500': component.stockQuantity < component.minimumStock,
                      'text-yellow-500': component.stockQuantity >= component.minimumStock && component.stockQuantity <= component.minimumStock * 2,
                      'text-green-500': component.stockQuantity > component.minimumStock * 2
                    }">
                      {{ component.stockQuantity }} {{ component.unitOfMeasureAbbreviation || 'ชิ้น' }}
                    </p>
                  </div>
                  <div class="mb-4">
                    <p class="text-sm text-gray-500">จำนวนขั้นต่ำ</p>
                    <p class="text-lg">{{ component.minimumStock }} {{ component.unitOfMeasureAbbreviation || 'ชิ้น' }}</p>
                  </div>
                  <div class="mb-4">
                    <p class="text-sm text-gray-500">ระยะเวลานำเข้า</p>
                    <p class="text-lg">{{ component.leadTime }} วัน</p>
                  </div>
                </div>
              </div>
              
              <div class="mt-6" *ngIf="component.imageUrl">
                <h2 class="text-lg font-semibold text-gray-700 mb-2">รูปภาพ</h2>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <img [src]="component.imageUrl" alt="รูปชิ้นส่วน" class="w-full h-auto rounded">
                </div>
              </div>
            </div>
          </div>
          
          <div *ngIf="!loading && !component" class="py-8 text-center">
            <p class="text-lg text-gray-500">ไม่พบข้อมูลชิ้นส่วน</p>
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
export class ComponentDetailComponent implements OnInit {
  private componentService = inject(ComponentService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  
  component: ComponentModel | null = null
  loading = true
  
  ngOnInit(): void {
    this.loadComponent()
  }
  
  loadComponent(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    if (id) {
      this.componentService.getComponentById(id).subscribe({
        next: (component) => {
          this.component = component
          this.loading = false
        },
        error: (error) => {
          console.error('Error loading component:', error)
          this.loading = false
          Swal.fire({
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่สามารถโหลดข้อมูลชิ้นส่วนได้',
            icon: 'error',
            confirmButtonText: 'ตกลง'
          })
        }
      })
    } else {
      this.loading = false
    }
  }
  
  deleteComponent(): void {
    if (!this.component) return
    
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
        this.componentService.deleteComponent(this.component!.id).subscribe({
          next: () => {
            Swal.fire(
              'ลบแล้ว!',
              'ข้อมูลชิ้นส่วนถูกลบเรียบร้อยแล้ว',
              'success'
            )
            this.router.navigate(['/components'])
          },
          error: (error) => {
            console.error('Error deleting component:', error)
            Swal.fire({
              title: 'เกิดข้อผิดพลาด',
              text: 'ไม่สามารถลบข้อมูลชิ้นส่วนได้',
              icon: 'error',
              confirmButtonText: 'ตกลง'
            })
          }
        })
      }
    })
  }
} 