import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, ActivatedRoute, Router } from '@angular/router'
import { MachineService } from '../../services/machine.service'
import { Machine } from '../../models/machine.model'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-machine-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-4">
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-800">รายละเอียดเครื่องจักร</h1>
            <div class="flex space-x-2">
              <a [routerLink]="['/machines/edit', machine?.id]" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                แก้ไข
              </a>
              <button (click)="deleteMachine()" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
                ลบ
              </button>
              <a routerLink="/machines" class="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded">
                กลับ
              </a>
            </div>
          </div>
          
          <div *ngIf="loading" class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          
          <div *ngIf="!loading && machine" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div class="mb-6">
                <h2 class="text-lg font-semibold text-gray-700 mb-2">ข้อมูลทั่วไป</h2>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="mb-4">
                    <p class="text-sm text-gray-500">ชื่อเครื่องจักร</p>
                    <p class="text-lg">{{ machine.name }}</p>
                  </div>
                  <div class="mb-4">
                    <p class="text-sm text-gray-500">รุ่น</p>
                    <p class="text-lg">{{ machine.modelNumber }}</p>
                  </div>
                  <div class="mb-4">
                    <p class="text-sm text-gray-500">หมายเลขซีเรียล</p>
                    <p class="text-lg">{{ machine.serialNumber || '-' }}</p>
                  </div>
                  <div class="mb-4">
                    <p class="text-sm text-gray-500">ผู้ผลิต</p>
                    <p class="text-lg">{{ machine.manufacturer || '-' }}</p>
                  </div>
                  <div class="mb-4">
                    <p class="text-sm text-gray-500">หมวดหมู่</p>
                    <p class="text-lg">{{ machine.categoryName || '-' }}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 class="text-lg font-semibold text-gray-700 mb-2">รายละเอียด</h2>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="whitespace-pre-line">{{ machine.description || 'ไม่มีรายละเอียด' }}</p>
                </div>
              </div>
            </div>
            
            <div>
              <div class="mb-6">
                <h2 class="text-lg font-semibold text-gray-700 mb-2">ข้อมูลวันที่</h2>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="mb-4">
                    <p class="text-sm text-gray-500">วันที่ผลิต</p>
                    <p class="text-lg">{{ machine.manufactureDate ? (machine.manufactureDate | date:'dd/MM/yyyy') : '-' }}</p>
                  </div>
                  <div class="mb-4">
                    <p class="text-sm text-gray-500">วันที่ติดตั้ง</p>
                    <p class="text-lg">{{ machine.installationDate ? (machine.installationDate | date:'dd/MM/yyyy') : '-' }}</p>
                  </div>
                  <div class="mb-4">
                    <p class="text-sm text-gray-500">วันที่ซื้อ</p>
                    <p class="text-lg">{{ machine.purchaseDate ? (machine.purchaseDate | date:'dd/MM/yyyy') : '-' }}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 class="text-lg font-semibold text-gray-700 mb-2">ตำแหน่งที่ตั้ง</h2>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p>{{ machine.location || '-' }}</p>
                </div>
              </div>
              
              <div class="mt-6" *ngIf="machine.imageUrl">
                <h2 class="text-lg font-semibold text-gray-700 mb-2">รูปภาพ</h2>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <img [src]="machine.imageUrl" alt="รูปเครื่องจักร" class="w-full h-auto rounded">
                </div>
              </div>
            </div>
          </div>
          
          <div *ngIf="!loading && !machine" class="py-8 text-center">
            <p class="text-lg text-gray-500">ไม่พบข้อมูลเครื่องจักร</p>
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
export class MachineDetailComponent implements OnInit {
  private machineService = inject(MachineService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  
  machine: Machine | null = null
  loading = true
  
  ngOnInit(): void {
    this.loadMachine()
  }
  
  loadMachine(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    if (id) {
      this.machineService.getMachineById(id).subscribe({
        next: (machine) => {
          this.machine = machine
          this.loading = false
        },
        error: (error) => {
          console.error('Error loading machine:', error)
          this.loading = false
          Swal.fire({
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่สามารถโหลดข้อมูลเครื่องจักรได้',
            icon: 'error',
            confirmButtonText: 'ตกลง'
          })
        }
      })
    } else {
      this.loading = false
    }
  }
  
  deleteMachine(): void {
    if (!this.machine) return
    
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
        this.machineService.deleteMachine(this.machine!.id).subscribe({
          next: () => {
            Swal.fire(
              'ลบแล้ว!',
              'ข้อมูลเครื่องจักรถูกลบเรียบร้อยแล้ว',
              'success'
            )
            this.router.navigate(['/machines'])
          },
          error: (error) => {
            console.error('Error deleting machine:', error)
            Swal.fire({
              title: 'เกิดข้อผิดพลาด',
              text: 'ไม่สามารถลบข้อมูลเครื่องจักรได้',
              icon: 'error',
              confirmButtonText: 'ตกลง'
            })
          }
        })
      }
    })
  }
} 