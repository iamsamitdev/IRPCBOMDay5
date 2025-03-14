export interface Component {
  id: number
  name: string
  partNumber: string
  description?: string
  price: number
  leadTime: number
  minimumStock: number
  stockQuantity: number
  imageUrl?: string
  categoryId?: number
  categoryName?: string
  unitOfMeasureId?: number
  unitOfMeasureName?: string
  unitOfMeasureAbbreviation?: string
  supplierId?: number
  supplierName?: string
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}

export interface CreateComponent {
  name: string
  partNumber: string
  description?: string
  price: number
  leadTime: number
  minimumStock: number
  imageUrl?: string
  categoryId?: number
  unitOfMeasureId?: number
  supplierId?: number
}

export interface UpdateComponent {
  id: number
  name: string
  partNumber: string
  description?: string
  price: number
  leadTime: number
  minimumStock: number
  imageUrl?: string
  categoryId?: number
  unitOfMeasureId?: number
  supplierId?: number
} 