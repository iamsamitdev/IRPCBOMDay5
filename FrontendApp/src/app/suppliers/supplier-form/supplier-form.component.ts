import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, ActivatedRoute, Router } from '@angular/router'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { SupplierService } from '../../services/supplier.service'
import { Supplier, CreateSupplier, UpdateSupplier } from '../../models/supplier.model'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="p-4">
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-800">{{ isEditMode ? 'แก้ไขซัพพลายเออร์' : 'เพิ่มซัพพลายเออร์ใหม่' }}</h1>
            <a routerLink="/suppliers" class="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded">
              ยกเลิก
            </a>
          </div>
          
          <div *ngIf="loading" class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          
          <form *ngIf="!loading" [formGroup]="supplierForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-6">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700 mb-1">ชื่อบริษัท <span class="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    id="name" 
                    formControlName="name" 
                    class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                    [ngClass]="{'border-red-500': isFieldInvalid('name')}"
                  >
                  <p *ngIf="isFieldInvalid('name')" class="mt-1 text-sm text-red-500">กรุณาระบุชื่อบริษัท</p>
                </div>
                
                <div>
                  <label for="contactPerson" class="block text-sm font-medium text-gray-700 mb-1">ผู้ติดต่อ</label>
                  <input 
                    type="text" 
                    id="contactPerson" 
                    formControlName="contactPerson" 
                    class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  >
                </div>
                
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
                  <input 
                    type="email" 
                    id="email" 
                    formControlName="email" 
                    class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                    [ngClass]="{'border-red-500': isFieldInvalid('email')}"
                  >
                  <p *ngIf="isFieldInvalid('email')" class="mt-1 text-sm text-red-500">กรุณาระบุอีเมลที่ถูกต้อง</p>
                </div>
              </div>
              
              <div class="space-y-6">
                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">โทรศัพท์</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    formControlName="phone" 
                    class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  >
                </div>
                
                <div>
                  <label for="address" class="block text-sm font-medium text-gray-700 mb-1">ที่อยู่</label>
                  <textarea 
                    id="address" 
                    formControlName="address" 
                    rows="3" 
                    class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div>
              <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">หมายเหตุ</label>
              <textarea 
                id="notes" 
                formControlName="notes" 
                rows="4" 
                class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
            
            <div class="flex justify-end">
              <button 
                type="submit" 
                class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded"
                [disabled]="supplierForm.invalid || submitting"
              >
                <span *ngIf="submitting" class="inline-block mr-2">
                  <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ isEditMode ? 'บันทึกการแก้ไข' : 'เพิ่มซัพพลายเออร์' }}
              </button>
            </div>
          </form>
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
export class SupplierFormComponent implements OnInit {
  private fb = inject(FormBuilder)
  private supplierService = inject(SupplierService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  
  supplierForm!: FormGroup
  isEditMode = false
  loading = true
  submitting = false
  supplierId?: number
  
  ngOnInit(): void {
    this.initForm()
    
    const id = this.route.snapshot.paramMap.get('id')
    if (id) {
      this.isEditMode = true
      this.supplierId = Number(id)
      this.loadSupplier(this.supplierId)
    } else {
      this.loading = false
    }
  }
  
  initForm(): void {
    this.supplierForm = this.fb.group({
      name: ['', Validators.required],
      contactPerson: [''],
      email: ['', [Validators.email]],
      phone: [''],
      address: [''],
      notes: ['']
    })
  }
  
  loadSupplier(id: number): void {
    this.supplierService.getSupplierById(id).subscribe({
      next: (supplier) => {
        this.supplierForm.patchValue({
          ...supplier
        })
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
  }
  
  isFieldInvalid(fieldName: string): boolean {
    const field = this.supplierForm.get(fieldName)
    return field ? field.invalid && (field.dirty || field.touched) : false
  }
  
  onSubmit(): void {
    if (this.supplierForm.invalid) return
    
    this.submitting = true
    
    if (this.isEditMode && this.supplierId) {
      const updateData: UpdateSupplier = {
        id: this.supplierId,
        ...this.supplierForm.value
      }
      
      this.supplierService.updateSupplier(this.supplierId, updateData).subscribe({
        next: () => {
          this.submitting = false
          Swal.fire({
            title: 'สำเร็จ!',
            text: 'อัปเดตข้อมูลซัพพลายเออร์เรียบร้อยแล้ว',
            icon: 'success',
            confirmButtonText: 'ตกลง'
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/suppliers', this.supplierId])
            }
          })
        },
        error: (error) => {
          console.error('Error updating supplier:', error)
          this.submitting = false
          Swal.fire({
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่สามารถอัปเดตข้อมูลซัพพลายเออร์ได้',
            icon: 'error',
            confirmButtonText: 'ตกลง'
          })
        }
      })
    } else {
      const createData: CreateSupplier = this.supplierForm.value
      
      this.supplierService.createSupplier(createData).subscribe({
        next: (newSupplier) => {
          this.submitting = false
          Swal.fire({
            title: 'สำเร็จ!',
            text: 'เพิ่มซัพพลายเออร์ใหม่เรียบร้อยแล้ว',
            icon: 'success',
            confirmButtonText: 'ตกลง'
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/suppliers', newSupplier.id])
            }
          })
        },
        error: (error) => {
          console.error('Error creating supplier:', error)
          this.submitting = false
          Swal.fire({
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่สามารถเพิ่มซัพพลายเออร์ใหม่ได้',
            icon: 'error',
            confirmButtonText: 'ตกลง'
          })
        }
      })
    }
  }
} 