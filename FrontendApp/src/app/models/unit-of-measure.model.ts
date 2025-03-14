export interface UnitOfMeasure {
  id: number
  name: string
  abbreviation: string
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}

export interface CreateUnitOfMeasure {
  name: string
  abbreviation: string
}

export interface UpdateUnitOfMeasure {
  id: number
  name: string
  abbreviation: string
} 