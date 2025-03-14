export interface BillOfMaterial {
  id: number
  machineId?: number
  machineName?: string
  parentComponentId: number
  parentComponentName: string
  parentComponentPartNumber: string
  childComponentId: number
  childComponentName: string
  childComponentPartNumber: string
  quantity: number
  unitOfMeasureAbbreviation?: string
  notes?: string
  level: number
}

export interface CreateBillOfMaterial {
  machineId?: number
  parentComponentId: number
  childComponentId: number
  quantity: number
  notes?: string
  level: number
}

export interface UpdateBillOfMaterial {
  id: number
  machineId?: number
  parentComponentId: number
  childComponentId: number
  quantity: number
  notes?: string
  level: number
}

export interface BomTreeNode {
  id: number
  componentId: number
  componentName: string
  partNumber: string
  quantity: number
  unitOfMeasureAbbreviation?: string
  level: number
  children: BomTreeNode[]
} 