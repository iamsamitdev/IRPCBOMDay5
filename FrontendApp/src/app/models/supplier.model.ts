export interface Supplier {
  id: number
  name: string
  contactPerson?: string
  phone?: string
  email?: string
  address?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}

export interface CreateSupplier {
  name: string
  contactPerson?: string
  phone?: string
  email?: string
  address?: string
  notes?: string
}

export interface UpdateSupplier {
  id: number
  name: string
  contactPerson?: string
  phone?: string
  email?: string
  address?: string
  notes?: string
} 