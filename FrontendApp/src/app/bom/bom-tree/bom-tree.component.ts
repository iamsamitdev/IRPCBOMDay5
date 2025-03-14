import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { BomService } from '../../services/bom.service'
import { MachineService } from '../../services/machine.service'
import { ComponentService } from '../../services/component.service'
import { BomTreeNode } from '../../models/bom.model'
import { Machine } from '../../models/machine.model'
import { Component as ComponentModel } from '../../models/component.model'

@Component({
  selector: 'app-bom-tree',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">โครงสร้าง BOM แบบต้นไม้</h1>
      </div>
      
      <div class="bg-white p-4 rounded shadow mb-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">เลือกเครื่องจักร</label>
            <select 
              [(ngModel)]="selectedMachineId" 
              (change)="loadMachineBomTree()"
              class="w-full p-2 border rounded"
            >
              <option [value]="0">-- เลือกเครื่องจักร --</option>
              <option *ngFor="let machine of machines" [value]="machine.id">
                {{ machine.name }}
              </option>
            </select>
          </div>
          
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">หรือเลือกชิ้นส่วน</label>
            <select 
              [(ngModel)]="selectedComponentId" 
              (change)="loadComponentBomTree()"
              class="w-full p-2 border rounded"
            >
              <option [value]="0">-- เลือกชิ้นส่วน --</option>
              <option *ngFor="let component of components" [value]="component.id">
                {{ component.name }} ({{ component.partNumber }})
              </option>
            </select>
          </div>
        </div>
      </div>
      
      <div *ngIf="isLoading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p class="mt-2 text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>
      
      <div *ngIf="!isLoading && bomTree.length === 0 && !componentTree" class="bg-white p-8 rounded shadow text-center">
        <p class="text-gray-600">กรุณาเลือกเครื่องจักรหรือชิ้นส่วนเพื่อดูโครงสร้าง BOM</p>
      </div>
      
      <div *ngIf="!isLoading && bomTree.length > 0" class="bg-white p-4 rounded shadow">
        <h2 class="text-xl font-semibold mb-4">โครงสร้าง BOM ของเครื่องจักร: {{ selectedMachineName }}</h2>
        
        <div class="pl-4">
          <ng-container *ngFor="let node of bomTree">
            <div class="bom-tree-node">
              <div class="flex items-center py-2">
                <span class="font-medium">{{ node.componentName }}</span>
                <span class="text-sm text-gray-500 ml-2">({{ node.partNumber }})</span>
                <span class="ml-4">จำนวน: {{ node.quantity }} {{ node.unitOfMeasureAbbreviation || '' }}</span>
              </div>
              
              <ng-container *ngTemplateOutlet="treeNodeTemplate; context: { $implicit: node }"></ng-container>
            </div>
          </ng-container>
        </div>
      </div>
      
      <div *ngIf="!isLoading && componentTree" class="bg-white p-4 rounded shadow">
        <h2 class="text-xl font-semibold mb-4">โครงสร้าง BOM ของชิ้นส่วน: {{ componentTree.componentName }}</h2>
        
        <div class="pl-4">
          <div class="bom-tree-node">
            <div class="flex items-center py-2">
              <span class="font-medium">{{ componentTree.componentName }}</span>
              <span class="text-sm text-gray-500 ml-2">({{ componentTree.partNumber }})</span>
              <span class="ml-4">จำนวน: {{ componentTree.quantity }} {{ componentTree.unitOfMeasureAbbreviation || '' }}</span>
            </div>
            
            <ng-container *ngTemplateOutlet="treeNodeTemplate; context: { $implicit: componentTree }"></ng-container>
          </div>
        </div>
      </div>
    </div>
    
    <ng-template #treeNodeTemplate let-node>
      <div *ngIf="node.children && node.children.length > 0" class="pl-6 border-l border-gray-300 ml-2">
        <div *ngFor="let child of node.children" class="bom-tree-node">
          <div class="flex items-center py-2">
            <span class="font-medium">{{ child.componentName }}</span>
            <span class="text-sm text-gray-500 ml-2">({{ child.partNumber }})</span>
            <span class="ml-4">จำนวน: {{ child.quantity }} {{ child.unitOfMeasureAbbreviation || '' }}</span>
          </div>
          
          <ng-container *ngTemplateOutlet="treeNodeTemplate; context: { $implicit: child }"></ng-container>
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    .bom-tree-node {
      position: relative;
    }
  `]
})
export class BomTreeComponent implements OnInit {
  private bomService = inject(BomService)
  private machineService = inject(MachineService)
  private componentService = inject(ComponentService)
  
  machines: Machine[] = []
  components: ComponentModel[] = []
  bomTree: BomTreeNode[] = []
  componentTree: BomTreeNode | null = null
  
  selectedMachineId = 0
  selectedComponentId = 0
  selectedMachineName = ''
  
  isLoading = false
  
  ngOnInit(): void {
    this.loadMachines()
    this.loadComponents()
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
  
  loadMachineBomTree(): void {
    if (this.selectedMachineId > 0) {
      this.isLoading = true
      this.componentTree = null
      this.selectedComponentId = 0
      
      const selectedMachine = this.machines.find(m => m.id === +this.selectedMachineId)
      if (selectedMachine) {
        this.selectedMachineName = selectedMachine.name
      }
      
      this.bomService.getBomTreeByMachine(this.selectedMachineId).subscribe({
        next: (tree) => {
          this.bomTree = tree
          this.isLoading = false
        },
        error: (error) => {
          console.error('Error loading BOM tree:', error)
          this.isLoading = false
        }
      })
    } else {
      this.bomTree = []
      this.selectedMachineName = ''
    }
  }
  
  loadComponentBomTree(): void {
    if (this.selectedComponentId > 0) {
      this.isLoading = true
      this.bomTree = []
      this.selectedMachineId = 0
      this.selectedMachineName = ''
      
      this.bomService.getBomTreeByComponent(this.selectedComponentId).subscribe({
        next: (tree) => {
          this.componentTree = tree
          this.isLoading = false
        },
        error: (error) => {
          console.error('Error loading component BOM tree:', error)
          this.isLoading = false
        }
      })
    } else {
      this.componentTree = null
    }
  }
} 