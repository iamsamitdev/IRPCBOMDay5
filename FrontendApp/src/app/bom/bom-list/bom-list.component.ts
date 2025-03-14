import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { BomService } from '../../services/bom.service'
import { MachineService } from '../../services/machine.service'
import { BillOfMaterial } from '../../models/bom.model'
import { Machine } from '../../models/machine.model'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-bom-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">รายการ Bill of Materials</h1>
        <a routerLink="/bom/create" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
          เพิ่ม BOM ใหม่
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
            <label class="block text-sm font-medium text-gray-700 mb-1">กรองตามเครื่องจักร</label>
            <select 
              [(ngModel)]="selectedMachineId" 
              (change)="filterByMachine()"
              class="w-full p-2 border rounded"
            >
              <option [value]="0">ทั้งหมด</option>
              <option *ngFor="let machine of machines" [value]="machine.id">
                {{ machine.name }}
              </option>
            </select>
          </div>
          
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">กรองตามระดับ</label>
            <select 
              [(ngModel)]="selectedLevel" 
              (change)="applyFilters()"
              class="w-full p-2 border rounded"
            >
              <option [value]="-1">ทั้งหมด</option>
              <option [value]="0">ระดับ 0 (เครื่องจักรหลัก)</option>
              <option [value]="1">ระดับ 1 (ชิ้นส่วนหลัก)</option>
              <option [value]="2">ระดับ 2 (ชิ้นส่วนย่อย)</option>
              <option [value]="3">ระดับ 3+</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="bg-gray-100">
                <th class="py-3 px-4 text-left">เครื่องจักร</th>
                <th class="py-3 px-4 text-left">ชิ้นส่วนหลัก</th>
                <th class="py-3 px-4 text-left">ชิ้นส่วนย่อย</th>
                <th class="py-3 px-4 text-left">จำนวน</th>
                <th class="py-3 px-4 text-left">หน่วย</th>
                <th class="py-3 px-4 text-left">ระดับ</th>
                <th class="py-3 px-4 text-left">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let bom of filteredBoms" class="border-b hover:bg-gray-50">
                <td class="py-3 px-4">{{ bom.machineName || '-' }}</td>
                <td class="py-3 px-4">
                  {{ bom.parentComponentName }}
                  <div class="text-xs text-gray-500">{{ bom.parentComponentPartNumber }}</div>
                </td>
                <td class="py-3 px-4">
                  {{ bom.childComponentName }}
                  <div class="text-xs text-gray-500">{{ bom.childComponentPartNumber }}</div>
                </td>
                <td class="py-3 px-4">{{ bom.quantity }}</td>
                <td class="py-3 px-4">{{ bom.unitOfMeasureAbbreviation || '-' }}</td>
                <td class="py-3 px-4">{{ bom.level }}</td>
                <td class="py-3 px-4">
                  <div class="flex space-x-2">
                    <a [routerLink]="['/bom', bom.id]" class="text-blue-500 hover:underline">ดู</a>
                    <a [routerLink]="['/bom/edit', bom.id]" class="text-green-500 hover:underline">แก้ไข</a>
                    <button (click)="deleteBom(bom.id)" class="text-red-500 hover:underline">ลบ</button>
                  </div>
                </td>
              </tr>
              
              <tr *ngIf="filteredBoms.length === 0">
                <td colspan="7" class="py-4 px-4 text-center text-gray-500">
                  ไม่พบข้อมูล BOM
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
export class BomListComponent implements OnInit {
  private bomService = inject(BomService)
  private machineService = inject(MachineService)
  
  boms: BillOfMaterial[] = []
  filteredBoms: BillOfMaterial[] = []
  machines: Machine[] = []
  
  searchTerm = ''
  selectedMachineId = 0
  selectedLevel = -1
  
  ngOnInit(): void {
    this.loadData()
  }
  
  loadData(): void {
    this.bomService.getAllBoms().subscribe(boms => {
      this.boms = boms
      this.filteredBoms = boms
    })
    
    this.machineService.getAllMachines().subscribe(machines => {
      this.machines = machines
    })
  }
  
  filterByMachine(): void {
    if (this.selectedMachineId > 0) {
      this.bomService.getBomsByMachine(this.selectedMachineId).subscribe(boms => {
        this.boms = boms
        this.applyFilters()
      })
    } else {
      this.bomService.getAllBoms().subscribe(boms => {
        this.boms = boms
        this.applyFilters()
      })
    }
  }
  
  applyFilters(): void {
    let filtered = [...this.boms]
    
    // กรองตามคำค้นหา
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase()
      filtered = filtered.filter(bom => 
        bom.parentComponentName.toLowerCase().includes(search) ||
        bom.parentComponentPartNumber.toLowerCase().includes(search) ||
        bom.childComponentName.toLowerCase().includes(search) ||
        bom.childComponentPartNumber.toLowerCase().includes(search)
      )
    }
    
    // กรองตามระดับ
    if (this.selectedLevel >= 0) {
      if (this.selectedLevel < 3) {
        filtered = filtered.filter(bom => bom.level === this.selectedLevel)
      } else {
        filtered = filtered.filter(bom => bom.level >= 3)
      }
    }
    
    this.filteredBoms = filtered
  }
  
  deleteBom(id: number): void {
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
        this.bomService.deleteBom(id).subscribe(() => {
          this.boms = this.boms.filter(bom => bom.id !== id)
          this.applyFilters()
          
          Swal.fire(
            'ลบแล้ว!',
            'ข้อมูล BOM ถูกลบเรียบร้อยแล้ว',
            'success'
          )
        })
      }
    })
  }
} 