import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, ActivatedRoute, Router } from '@angular/router'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MachineService } from '../../services/machine.service'
import { CategoryService } from '../../services/category.service'
import { Machine, CreateMachine, UpdateMachine } from '../../models/machine.model'
import { Category } from '../../models/category.model'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-machine-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="p-4">
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-800">{{ isEditMode ? 'แก้ไขเครื่องจักร' : 'เพิ่มเครื่องจักรใหม่' }}</h1>
            <a routerLink="/machines" class="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded">
              ยกเลิก
            </a>
          </div>
          
          <div *ngIf="loading" class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          
          <form *ngIf="!loading" [formGroup]="machineForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-6">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700 mb-1">ชื่อเครื่องจักร <span class="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    id="name" 
                    formControlName="name" 
                    class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                    [ngClass]="{'border-red-500': isFieldInvalid('name')}"
                  >
                  <p *ngIf="isFieldInvalid('name')" class="mt-1 text-sm text-red-500">กรุณาระบุชื่อเครื่องจักร</p>
                </div>
                
                <div>
                  <label for="modelNumber" class="block text-sm font-medium text-gray-700 mb-1">รุ่น <span class="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    id="modelNumber" 
                    formControlName="modelNumber" 
                    class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                    [ngClass]="{'border-red-500': isFieldInvalid('modelNumber')}"
                  >
                  <p *ngIf="isFieldInvalid('modelNumber')" class="mt-1 text-sm text-red-500">กรุณาระบุรุ่นเครื่องจักร</p>
                </div>
                
                <div>
                  <label for="serialNumber" class="block text-sm font-medium text-gray-700 mb-1">หมายเลขซีเรียล</label>
                  <input 
                    type="text" 
                    id="serialNumber" 
                    formControlName="serialNumber" 
                    class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  >
                </div>
                
                <div>
                  <label for="manufacturer" class="block text-sm font-medium text-gray-700 mb-1">ผู้ผลิต</label>
                  <input 
                    type="text" 
                    id="manufacturer" 
                    formControlName="manufacturer" 
                    class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  >
                </div>
                
                <div>
                  <label for="categoryId" class="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่</label>
                  <select 
                    id="categoryId" 
                    formControlName="categoryId" 
                    class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option [ngValue]="null">-- เลือกหมวดหมู่ --</option>
                    <option *ngFor="let category of categories" [ngValue]="category.id">
                      {{ category.name }}
                    </option>
                  </select>
                </div>
              </div>
              
              <div class="space-y-6">
                <div>
                  <label for="manufactureDate" class="block text-sm font-medium text-gray-700 mb-1">วันที่ผลิต</label>
                  <input 
                    type="date" 
                    id="manufactureDate" 
                    formControlName="manufactureDate" 
                    class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  >
                </div>
                
                <div>
                  <label for="installationDate" class="block text-sm font-medium text-gray-700 mb-1">วันที่ติดตั้ง</label>
                  <input 
                    type="date" 
                    id="installationDate" 
                    formControlName="installationDate" 
                    class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  >
                </div>
                
                <div>
                  <label for="purchaseDate" class="block text-sm font-medium text-gray-700 mb-1">วันที่ซื้อ</label>
                  <input 
                    type="date" 
                    id="purchaseDate" 
                    formControlName="purchaseDate" 
                    class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  >
                </div>
                
                <div>
                  <label for="location" class="block text-sm font-medium text-gray-700 mb-1">ตำแหน่งที่ตั้ง</label>
                  <input 
                    type="text" 
                    id="location" 
                    formControlName="location" 
                    class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  >
                </div>
                
                <div>
                  <label for="imageUrl" class="block text-sm font-medium text-gray-700 mb-1">URL รูปภาพ</label>
                  <input 
                    type="text" 
                    id="imageUrl" 
                    formControlName="imageUrl" 
                    class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  >
                </div>
              </div>
            </div>
            
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 mb-1">รายละเอียด</label>
              <textarea 
                id="description" 
                formControlName="description" 
                rows="4" 
                class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
            
            <div class="flex justify-end">
              <button 
                type="submit" 
                class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded"
                [disabled]="machineForm.invalid || submitting"
              >
                <span *ngIf="submitting" class="inline-block mr-2">
                  <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ isEditMode ? 'บันทึกการแก้ไข' : 'เพิ่มเครื่องจักร' }}
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
export class MachineFormComponent implements OnInit {
  private fb = inject(FormBuilder)
  private machineService = inject(MachineService)
  private categoryService = inject(CategoryService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  
  machineForm!: FormGroup
  categories: Category[] = []
  isEditMode = false
  loading = true
  submitting = false
  machineId?: number
  
  ngOnInit(): void {
    this.initForm()
    this.loadCategories()
    
    const id = this.route.snapshot.paramMap.get('id')
    if (id) {
      this.isEditMode = true
      this.machineId = Number(id)
      this.loadMachine(this.machineId)
    } else {
      this.loading = false
    }
  }
  
  initForm(): void {
    this.machineForm = this.fb.group({
      name: ['', Validators.required],
      modelNumber: ['', Validators.required],
      serialNumber: [''],
      description: [''],
      manufacturer: [''],
      manufactureDate: [null],
      installationDate: [null],
      purchaseDate: [null],
      location: [''],
      imageUrl: [''],
      categoryId: [null]
    })
  }
  
  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories
      },
      error: (error) => {
        console.error('Error loading categories:', error)
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถโหลดข้อมูลหมวดหมู่ได้',
          icon: 'error',
          confirmButtonText: 'ตกลง'
        })
      }
    })
  }
  
  loadMachine(id: number): void {
    this.machineService.getMachineById(id).subscribe({
      next: (machine) => {
        // แปลงวันที่จาก string เป็น Date object สำหรับ input type="date"
        const manufactureDate = machine.manufactureDate ? new Date(machine.manufactureDate).toISOString().split('T')[0] : null
        const installationDate = machine.installationDate ? new Date(machine.installationDate).toISOString().split('T')[0] : null
        const purchaseDate = machine.purchaseDate ? new Date(machine.purchaseDate).toISOString().split('T')[0] : null
        
        this.machineForm.patchValue({
          ...machine,
          manufactureDate,
          installationDate,
          purchaseDate
        })
        
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
  }
  
  isFieldInvalid(fieldName: string): boolean {
    const field = this.machineForm.get(fieldName)
    return field ? field.invalid && (field.dirty || field.touched) : false
  }
  
  onSubmit(): void {
    if (this.machineForm.invalid) return
    
    this.submitting = true
    
    if (this.isEditMode && this.machineId) {
      const updateData: UpdateMachine = {
        ...this.machineForm.value
      }
      
      this.machineService.updateMachine(this.machineId, updateData).subscribe({
        next: () => {
          this.submitting = false
          Swal.fire({
            title: 'สำเร็จ!',
            text: 'อัปเดตข้อมูลเครื่องจักรเรียบร้อยแล้ว',
            icon: 'success',
            confirmButtonText: 'ตกลง'
          }).then(() => {
            this.router.navigate(['/machines', this.machineId])
          })
        },
        error: (error) => {
          console.error('Error updating machine:', error)
          this.submitting = false
          Swal.fire({
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่สามารถอัปเดตข้อมูลเครื่องจักรได้',
            icon: 'error',
            confirmButtonText: 'ตกลง'
          })
        }
      })
    } else {
      const createData: CreateMachine = this.machineForm.value
      
      this.machineService.createMachine(createData).subscribe({
        next: (newMachine) => {
          this.submitting = false
          Swal.fire({
            title: 'สำเร็จ!',
            text: 'เพิ่มเครื่องจักรใหม่เรียบร้อยแล้ว',
            icon: 'success',
            confirmButtonText: 'ตกลง'
          }).then(() => {
            this.router.navigate(['/machines', newMachine.id])
          })
        },
        error: (error) => {
          console.error('Error creating machine:', error)
          this.submitting = false
          Swal.fire({
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่สามารถเพิ่มเครื่องจักรใหม่ได้',
            icon: 'error',
            confirmButtonText: 'ตกลง'
          })
        }
      })
    }
  }
} 