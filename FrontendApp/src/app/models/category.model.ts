export interface Category {
  id: number
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}

export interface CreateCategory {
  name: string
  description?: string
}

export interface UpdateCategory {
  id: number
  name: string
  description?: string
} 