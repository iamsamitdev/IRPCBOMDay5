import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, ActivatedRoute, Router } from '@angular/router'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { BomService } from '../../services/bom.service'
import { MachineService } from '../../services/machine.service'
import { ComponentService } from '../../services/component.service'
import { BillOfMaterial, CreateBillOfMaterial, UpdateBillOfMaterial } from '../../models/bom.model'
import { Machine } from '../../models/machine.model'
import { Component as ComponentModel } from '../../models/component.model'

@Component({
  selector: 'app-bom-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">{{ isEditMode ? 'แก้ไข' : 'สร้าง' }} Bill of Material</h1>
        <button 
          (click)="goBack()" 
          class="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
        >
          ย้อนกลับ
        </button>
      </div>
      
      <div *ngIf="isLoading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p class="mt-2 text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>
      
      <form *ngIf="!isLoading" [formGroup]="bomForm" (ngSubmit)="onSubmit()" class="bg-white p-6 rounded shadow">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">เครื่องจักร (ถ้ามี)</label>
            <select formControlName="machineId" class="w-full p-2 border rounded">
              <option [value]="null">-- ไม่มีเครื่องจักร --</option>
              <option *ngFor="let machine of machines" [value]="machine.id">
                {{ machine.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ระดับ</label>
            <select formControlName="level" class="w-full p-2 border rounded">
              <option [value]="0">ระดับ 0 (เครื่องจักรหลัก)</option>
              <option [value]="1">ระดับ 1 (ชิ้นส่วนหลัก)</option>
              <option [value]="2">ระดับ 2 (ชิ้นส่วนย่อย)</option>
              <option [value]="3">ระดับ 3</option>
              <option [value]="4">ระดับ 4</option>
              <option [value]="5">ระดับ 5</option>
            </select>
            <div *ngIf="bomForm.get('level')?.invalid && bomForm.get('level')?.touched" class="text-red-500 text-sm mt-1">
              กรุณาเลือกระดับ
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ชิ้นส่วนหลัก</label>
            <select formControlName="parentComponentId" class="w-full p-2 border rounded">
              <option [value]="null">-- เลือกชิ้นส่วนหลัก --</option>
              <option *ngFor="let component of components" [value]="component.id">
                {{ component.name }} ({{ component.partNumber }})
              </option>
            </select>
            <div *ngIf="bomForm.get('parentComponentId')?.invalid && bomForm.get('parentComponentId')?.touched" class="text-red-500 text-sm mt-1">
              กรุณาเลือกชิ้นส่วนหลัก
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ชิ้นส่วนย่อย</label>
            <select formControlName="childComponentId" class="w-full p-2 border rounded">
              <option [value]="null">-- เลือกชิ้นส่วนย่อย --</option>
              <option *ngFor="let component of components" [value]="component.id">
                {{ component.name }} ({{ component.partNumber }})
              </option>
            </select>
            <div *ngIf="bomForm.get('childComponentId')?.invalid && bomForm.get('childComponentId')?.touched" class="text-red-500 text-sm mt-1">
              กรุณาเลือกชิ้นส่วนย่อย
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">จำนวน</label>
            <input 
              type="number" 
              formControlName="quantity" 
              class="w-full p-2 border rounded"
              min="0.01"
              step="0.01"
            >
            <div *ngIf="bomForm.get('quantity')?.invalid && bomForm.get('quantity')?.touched" class="text-red-500 text-sm mt-1">
              กรุณาระบุจำนวนที่มากกว่า 0
            </div>
          </div>
          
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">หมายเหตุ</label>
            <textarea 
              formControlName="notes" 
              rows="3" 
              class="w-full p-2 border rounded"
              placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"
            ></textarea>
          </div>
        </div>
        
        <div class="mt-6 flex justify-end">
          <button 
            type="button" 
            (click)="goBack()" 
            class="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded mr-2"
          >
            ยกเลิก
          </button>
          <button 
            type="submit" 
            [disabled]="bomForm.invalid || isSubmitting"
            class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:bg-blue-300"
          >
            {{ isSubmitting ? 'กำลังบันทึก...' : (isEditMode ? 'อัปเดต' : 'บันทึก') }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class BomFormComponent implements OnInit {
  private fb = inject(FormBuilder)
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private bomService = inject(BomService)
  private machineService = inject(MachineService)
  private componentService = inject(ComponentService)
  
  bomForm: FormGroup = this.fb.group({
    machineId: [null],
    parentComponentId: [null, Validators.required],
    childComponentId: [null, Validators.required],
    quantity: [1, [Validators.required, Validators.min(0.01)]],
    notes: [''],
    level: [1, Validators.required]
  })
  
  machines: Machine[] = []
  components: ComponentModel[] = []
  
  bomId: number | null = null
  isEditMode = false
  isLoading = false
  isSubmitting = false
  
  ngOnInit(): void {
    this.loadMachines()
    this.loadComponents()
    
    const id = this.route.snapshot.paramMap.get('id')
    if (id) {
      this.bomId = +id
      this.isEditMode = true
      this.loadBomDetails(this.bomId)
    }
  }
  
  loadMachines(): void {
    this.machineService.getAllMachines().subscribe(machines => {
      this.machines = machines
    })
  }
  
  loadComponents(): void {
    this.componentService.getAllComponents().subscribe(components => {
      this.components = components
    })
  }
  
  loadBomDetails(id: number): void {
    this.isLoading = true
    this.bomService.getBomById(id).subscribe({
      next: (bom) => {
        this.bomForm.patchValue({
          machineId: bom.machineId,
          parentComponentId: bom.parentComponentId,
          childComponentId: bom.childComponentId,
          quantity: bom.quantity,
          notes: bom.notes,
          level: bom.level
        })
        this.isLoading = false
      },
      error: (error) => {
        console.error('Error loading BOM details:', error)
        this.isLoading = false
        this.router.navigate(['/bom'])
      }
    })
  }
  
  onSubmit(): void {
    if (this.bomForm.invalid) {
      return
    }
    
    this.isSubmitting = true
    
    if (this.isEditMode && this.bomId) {
      const updateBom: UpdateBillOfMaterial = {
        id: this.bomId,
        ...this.bomForm.value
      }
      
      this.bomService.updateBom(this.bomId, updateBom).subscribe({
        next: () => {
          this.isSubmitting = false
          this.router.navigate(['/bom'])
        },
        error: (error) => {
          console.error('Error updating BOM:', error)
          this.isSubmitting = false
        }
      })
    } else {
      const newBom: CreateBillOfMaterial = this.bomForm.value
      
      this.bomService.createBom(newBom).subscribe({
        next: () => {
          this.isSubmitting = false
          this.router.navigate(['/bom'])
        },
        error: (error) => {
          console.error('Error creating BOM:', error)
          this.isSubmitting = false
        }
      })
    }
  }
  
  goBack(): void {
    this.router.navigate(['/bom'])
  }
} 