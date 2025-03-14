import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, ActivatedRoute, Router } from '@angular/router'
import { BomService } from '../../services/bom.service'
import { BillOfMaterial } from '../../models/bom.model'

@Component({
  selector: 'app-bom-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">รายละเอียด Bill of Material</h1>
        <div class="flex space-x-2">
          <button 
            (click)="goBack()" 
            class="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            ย้อนกลับ
          </button>
          <a 
            [routerLink]="['/bom/edit', bomId]" 
            class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            แก้ไข
          </a>
        </div>
      </div>
      
      <div *ngIf="isLoading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p class="mt-2 text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>
      
      <div *ngIf="!isLoading && bom" class="bg-white p-6 rounded shadow">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 class="text-lg font-semibold mb-4">ข้อมูลทั่วไป</h2>
            
            <div class="mb-4">
              <p class="text-sm text-gray-500">เครื่องจักร</p>
              <p class="font-medium">{{ bom.machineName || 'ไม่มีเครื่องจักร' }}</p>
            </div>
            
            <div class="mb-4">
              <p class="text-sm text-gray-500">ระดับ</p>
              <p class="font-medium">
                {{ bom.level }} 
                <span class="text-sm text-gray-500">
                  {{ getLevelDescription(bom.level) }}
                </span>
              </p>
            </div>
            
            <div class="mb-4">
              <p class="text-sm text-gray-500">จำนวน</p>
              <p class="font-medium">{{ bom.quantity }} {{ bom.unitOfMeasureAbbreviation || '' }}</p>
            </div>
            
            <div *ngIf="bom.notes">
              <p class="text-sm text-gray-500">หมายเหตุ</p>
              <p class="font-medium">{{ bom.notes }}</p>
            </div>
          </div>
          
          <div>
            <h2 class="text-lg font-semibold mb-4">ข้อมูลชิ้นส่วน</h2>
            
            <div class="mb-4">
              <p class="text-sm text-gray-500">ชิ้นส่วนหลัก</p>
              <p class="font-medium">{{ bom.parentComponentName }}</p>
              <p class="text-sm text-gray-500">รหัสชิ้นส่วน: {{ bom.parentComponentPartNumber }}</p>
            </div>
            
            <div class="mb-4">
              <p class="text-sm text-gray-500">ชิ้นส่วนย่อย</p>
              <p class="font-medium">{{ bom.childComponentName }}</p>
              <p class="text-sm text-gray-500">รหัสชิ้นส่วน: {{ bom.childComponentPartNumber }}</p>
            </div>
          </div>
        </div>
        
        <div class="mt-8 flex justify-between">
          <button 
            (click)="deleteBom()" 
            class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          >
            ลบรายการนี้
          </button>
          
          <div class="flex space-x-2">
            <a 
              [routerLink]="['/bom/tree']" 
              [queryParams]="{machineId: bom.machineId}" 
              *ngIf="bom.machineId"
              class="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              ดูโครงสร้าง BOM ของเครื่องจักรนี้
            </a>
            
            <a 
              [routerLink]="['/components', bom.childComponentId]" 
              class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              ดูรายละเอียดชิ้นส่วนย่อย
            </a>
          </div>
        </div>
      </div>
      
      <div *ngIf="!isLoading && !bom" class="bg-white p-8 rounded shadow text-center">
        <p class="text-gray-600">ไม่พบข้อมูล BOM ที่ต้องการ</p>
        <button 
          (click)="goBack()" 
          class="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          กลับไปยังรายการ BOM
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class BomDetailComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private bomService = inject(BomService)
  
  bomId: number = 0
  bom: BillOfMaterial | null = null
  isLoading = false
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')
    if (id) {
      this.bomId = +id
      this.loadBomDetails()
    } else {
      this.router.navigate(['/bom'])
    }
  }
  
  loadBomDetails(): void {
    this.isLoading = true
    this.bomService.getBomById(this.bomId).subscribe({
      next: (bom) => {
        this.bom = bom
        this.isLoading = false
      },
      error: (error) => {
        console.error('Error loading BOM details:', error)
        this.isLoading = false
      }
    })
  }
  
  getLevelDescription(level: number): string {
    switch (level) {
      case 0:
        return '(เครื่องจักรหลัก)'
      case 1:
        return '(ชิ้นส่วนหลัก)'
      case 2:
        return '(ชิ้นส่วนย่อย)'
      default:
        return `(ชิ้นส่วนย่อยระดับ ${level})`
    }
  }
  
  deleteBom(): void {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบรายการนี้?')) {
      this.bomService.deleteBom(this.bomId).subscribe({
        next: () => {
          this.router.navigate(['/bom'])
        },
        error: (error) => {
          console.error('Error deleting BOM:', error)
        }
      })
    }
  }
  
  goBack(): void {
    this.router.navigate(['/bom'])
  }
} 