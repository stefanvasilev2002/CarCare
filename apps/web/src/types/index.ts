export type ServiceType = 
  | 'OIL_CHANGE'
  | 'TIRE_ROTATION'
  | 'BRAKE_SERVICE'
  | 'ENGINE_TUNE_UP'
  | 'TRANSMISSION'
  | 'BATTERY'
  | 'INSPECTION'
  | 'REGISTRATION'
  | 'OTHER'

export interface User {
  id: string
  email: string
  name?: string
  createdAt: Date
  updatedAt: Date
}

export interface Vehicle {
  id: string
  userId: string
  make: string
  model: string
  year: number
  vin?: string
  mileage: number
  color?: string
  plateNumber?: string
  createdAt: Date
  updatedAt: Date
}

export interface Service {
  id: string
  vehicleId: string
  userId: string
  type: ServiceType
  description: string
  cost: number
  mileage: number
  serviceDate: Date
  provider: string
  location?: string
  photos?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Reminder {
  id: string
  vehicleId: string
  type: ServiceType
  description: string
  dueDate?: Date
  dueMileage?: number
  isCompleted: boolean
  createdAt: Date
  updatedAt: Date
}

export interface VehicleWithServices extends Vehicle {
  services: Service[]
  reminders: Reminder[]
}

export interface CreateVehicleData {
  make: string
  model: string
  year: number
  vin?: string
  mileage: number
  color?: string
  plateNumber?: string
}

export interface CreateServiceData {
  vehicleId: string
  type: ServiceType
  description: string
  cost: number
  mileage: number
  serviceDate: Date
  provider: string
  location?: string
  photos?: string
  notes?: string
}

export interface CreateReminderData {
  vehicleId: string
  type: ServiceType
  description: string
  dueDate?: Date
  dueMileage?: number
}