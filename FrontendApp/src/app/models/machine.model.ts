export interface Machine {
  id: number
  name: string
  modelNumber: string
  serialNumber?: string
  description?: string
  manufacturer?: string
  manufactureDate?: Date
  installationDate?: Date
  purchaseDate?: Date
  location?: string
  imageUrl?: string
  categoryId?: number
  categoryName?: string
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
  
  // เพิ่ม index signature
  [key: string]: any
}

export interface CreateMachine {
  name: string
  modelNumber: string
  serialNumber?: string
  description?: string
  manufacturer?: string
  manufactureDate?: Date
  installationDate?: Date
  location?: string
  imageUrl?: string
}

export interface UpdateMachine {
  id: number
  name: string
  modelNumber: string
  serialNumber?: string
  description?: string
  manufacturer?: string
  manufactureDate?: Date
  installationDate?: Date
  location?: string
  imageUrl?: string
} 