import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, ActivatedRoute, Router } from '@angular/router'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ComponentService } from '../../services/component.service'
import { CategoryService } from '../../services/category.service'
import { SupplierService } from '../../services/supplier.service'
import { UnitOfMeasureService } from '../../services/unit-of-measure.service'
import { Component as ComponentModel, CreateComponent, UpdateComponent } from '../../models/component.model'
import { Category } from '../../models/category.model'
import { Supplier } from '../../models/supplier.model'
import { UnitOfMeasure } from '../../models/unit-of-measure.model'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-component-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="p-4">
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-800">{{ isEditMode ? 'แก้ไขชิ้นส่วน' : 'เพิ่มชิ้นส่วนใหม่' }}</h1>
            <a routerLink="/components" class="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded">
              ยกเลิก
            </a>
          </div>
          
          <div *ngIf="loading" class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          
          <form *ngIf="!loading" [formGroup]="componentForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-6">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700 mb-1">ชื่อชิ้นส่วน <span class="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    id="name" 
                    formControlName="name" 
                    class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                    [ngClass]="{'border-red-500': isFieldInvalid('name')}"
                  >
                  <p *ngIf="isFieldInvalid('name')" class="mt-1 text-sm text-red-500">กรุณาระบุชื่อชิ้นส่วน</p>
                </div>
                
                <div>
                  <label for="partNumber" class="block text-sm font-medium text-gray-700 mb-1">รหัสชิ้นส่วน <span class="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    id="partNumber" 
                    formControlName="partNumber" 
                    class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                    [ngClass]="{'border-red-500': isFieldInvalid('partNumber')}"
                  >
                  <p *ngIf="isFieldInvalid('partNumber')" class="mt-1 text-sm text-red-500">กรุณาระบุรหัสชิ้นส่วน</p>
                </div>
                
                <div>
                  <label for="categoryId" class="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่ <span class="text-red-500">*</span></label>
                  <select 
                    id="categoryId" 
                    formControlName="categoryId" 
                    class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                    [ngClass]="{'border-red-500': isFieldInvalid('categoryId')}"
                  >
                    <option [ngValue]="null">-- เลือกหมวดหมู่ --</option>
                    <option *ngFor="let category of categories" [ngValue]="category.id">{{ category.name }}</option>
                  </select>
                  <p *ngIf="isFieldInvalid('categoryId')" class="mt-1 text-sm text-red-500">กรุณาเลือกหมวดหมู่</p>
                </div>
                
                <div>
                  <label for="supplierId" class="block text-sm font-medium text-gray-700 mb-1">ซัพพลายเออร์</label>
                  <select 
                    id="supplierId" 
                    formControlName="supplierId" 
                    class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option [ngValue]="null">-- เลือกซัพพลายเออร์ --</option>
                    <option *ngFor="let supplier of suppliers" [ngValue]="supplier.id">{{ supplier.name }}</option>
                  </select>
                </div>
                
                <div>
                  <label for="price" class="block text-sm font-medium text-gray-700 mb-1">ราคา</label>
                  <input 
                    type="number" 
                    id="price" 
                    formControlName="price" 
                    class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                  >
                </div>
              </div>
              
              <div class="space-y-6">
                <div>
                  <label for="stockQuantity" class="block text-sm font-medium text-gray-700 mb-1">จำนวนในคลัง</label>
                  <input 
                    type="number" 
                    id="stockQuantity" 
                    formControlName="stockQuantity" 
                    class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  >
                </div>
                
                <div>
                  <label for="minimumStock" class="block text-sm font-medium text-gray-700 mb-1">จำนวนขั้นต่ำ</label>
                  <input 
                    type="number" 
                    id="minimumStock" 
                    formControlName="minimumStock" 
                    class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  >
                </div>
                
                <div>
                  <label for="leadTime" class="block text-sm font-medium text-gray-700 mb-1">ระยะเวลาสั่งซื้อ (วัน)</label>
                  <input 
                    type="number" 
                    id="leadTime" 
                    formControlName="leadTime" 
                    class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  >
                </div>
                
                <div>
                  <label for="unitOfMeasureId" class="block text-sm font-medium text-gray-700 mb-1">หน่วยนับ</label>
                  <select 
                    id="unitOfMeasureId" 
                    formControlName="unitOfMeasureId" 
                    class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option [ngValue]="null">-- เลือกหน่วยนับ --</option>
                    <option *ngFor="let unit of unitsOfMeasure" [ngValue]="unit.id">{{ unit.name }}</option>
                  </select>
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
                [disabled]="componentForm.invalid || submitting"
              >
                <span *ngIf="submitting" class="inline-block mr-2">
                  <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ isEditMode ? 'บันทึกการแก้ไข' : 'เพิ่มชิ้นส่วน' }}
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
export class ComponentFormComponent implements OnInit {
  private fb = inject(FormBuilder)
  private componentService = inject(ComponentService)
  private categoryService = inject(CategoryService)
  private supplierService = inject(SupplierService)
  private unitOfMeasureService = inject(UnitOfMeasureService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  
  componentForm!: FormGroup
  isEditMode = false
  loading = true
  submitting = false
  componentId?: number
  
  categories: Category[] = []
  suppliers: Supplier[] = []
  unitsOfMeasure: UnitOfMeasure[] = []
  
  ngOnInit(): void {
    this.initForm()
    this.loadCategories()
    this.loadSuppliers()
    this.loadUnitsOfMeasure()
    
    const id = this.route.snapshot.paramMap.get('id')
    if (id) {
      this.isEditMode = true
      this.componentId = Number(id)
      this.loadComponent(this.componentId)
    } else {
      this.loading = false
    }
  }
  
  initForm(): void {
    this.componentForm = this.fb.group({
      name: ['', Validators.required],
      partNumber: ['', Validators.required],
      categoryId: [null, Validators.required],
      supplierId: [null],
      price: [0],
      stockQuantity: [0],
      minimumStock: [0],
      leadTime: [0],
      unitOfMeasureId: [null],
      imageUrl: [''],
      description: ['']
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
  
  loadSuppliers(): void {
    this.supplierService.getAllSuppliers().subscribe({
      next: (suppliers) => {
        this.suppliers = suppliers
      },
      error: (error) => {
        console.error('Error loading suppliers:', error)
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถโหลดข้อมูลซัพพลายเออร์ได้',
          icon: 'error',
          confirmButtonText: 'ตกลง'
        })
      }
    })
  }
  
  loadUnitsOfMeasure(): void {
    this.unitOfMeasureService.getAllUnitOfMeasures().subscribe({
      next: (units: UnitOfMeasure[]) => {
        this.unitsOfMeasure = units
      },
      error: (error) => {
        console.error('Error loading units of measure:', error)
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถโหลดข้อมูลหน่วยนับได้',
          icon: 'error',
          confirmButtonText: 'ตกลง'
        })
      }
    })
  }
  
  loadComponent(id: number): void {
    this.componentService.getComponentById(id).subscribe({
      next: (component) => {
        this.componentForm.patchValue({
          ...component
        })
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
  }
  
  isFieldInvalid(fieldName: string): boolean {
    const field = this.componentForm.get(fieldName)
    return field ? field.invalid && (field.dirty || field.touched) : false
  }
  
  onSubmit(): void {
    if (this.componentForm.invalid) return
    
    this.submitting = true
    
    if (this.isEditMode && this.componentId) {
      const updateData: UpdateComponent = {
        ...this.componentForm.value
      }
      
      this.componentService.updateComponent(this.componentId, updateData).subscribe({
        next: () => {
          this.submitting = false
          Swal.fire({
            title: 'สำเร็จ!',
            text: 'อัปเดตข้อมูลชิ้นส่วนเรียบร้อยแล้ว',
            icon: 'success',
            confirmButtonText: 'ตกลง'
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/components', this.componentId])
            }
          })
        },
        error: (error) => {
          console.error('Error updating component:', error)
          this.submitting = false
          Swal.fire({
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่สามารถอัปเดตข้อมูลชิ้นส่วนได้',
            icon: 'error',
            confirmButtonText: 'ตกลง'
          })
        }
      })
    } else {
      const createData: CreateComponent = this.componentForm.value
      
      this.componentService.createComponent(createData).subscribe({
        next: (newComponent) => {
          this.submitting = false
          Swal.fire({
            title: 'สำเร็จ!',
            text: 'เพิ่มชิ้นส่วนใหม่เรียบร้อยแล้ว',
            icon: 'success',
            confirmButtonText: 'ตกลง'
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/components', newComponent.id])
            }
          })
        },
        error: (error) => {
          console.error('Error creating component:', error)
          this.submitting = false
          Swal.fire({
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่สามารถเพิ่มชิ้นส่วนใหม่ได้',
            icon: 'error',
            confirmButtonText: 'ตกลง'
          })
        }
      })
    }
  }
} 