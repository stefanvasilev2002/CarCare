import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, Vehicle, Service, VehicleWithServices } from '@/types'

interface AppState {
  // User state
  user: User | null
  setUser: (user: User | null) => void
  
  // Vehicles state
  vehicles: VehicleWithServices[]
  setVehicles: (vehicles: VehicleWithServices[]) => void
  addVehicle: (vehicle: VehicleWithServices) => void
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void
  removeVehicle: (id: string) => void
  
  // Selected vehicle
  selectedVehicle: VehicleWithServices | null
  setSelectedVehicle: (vehicle: VehicleWithServices | null) => void
  
  // Services state
  addService: (vehicleId: string, service: Service) => void
  updateService: (vehicleId: string, serviceId: string, service: Partial<Service>) => void
  removeService: (vehicleId: string, serviceId: string) => void
  
  // Loading states
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // User state
      user: null,
      setUser: (user) => set({ user }),
      
      // Vehicles state
      vehicles: [],
      setVehicles: (vehicles) => set({ vehicles }),
      addVehicle: (vehicle) => set((state) => ({ 
        vehicles: [...state.vehicles, vehicle] 
      })),
      updateVehicle: (id, updatedVehicle) => set((state) => ({
        vehicles: state.vehicles.map(vehicle => 
          vehicle.id === id ? { ...vehicle, ...updatedVehicle } : vehicle
        )
      })),
      removeVehicle: (id) => set((state) => ({
        vehicles: state.vehicles.filter(vehicle => vehicle.id !== id),
        selectedVehicle: state.selectedVehicle?.id === id ? null : state.selectedVehicle
      })),
      
      // Selected vehicle
      selectedVehicle: null,
      setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),
      
      // Services state
      addService: (vehicleId, service) => set((state) => ({
        vehicles: state.vehicles.map(vehicle => 
          vehicle.id === vehicleId 
            ? { ...vehicle, services: [...vehicle.services, service] }
            : vehicle
        ),
        selectedVehicle: state.selectedVehicle?.id === vehicleId
          ? { ...state.selectedVehicle, services: [...state.selectedVehicle.services, service] }
          : state.selectedVehicle
      })),
      updateService: (vehicleId, serviceId, updatedService) => set((state) => ({
        vehicles: state.vehicles.map(vehicle => 
          vehicle.id === vehicleId 
            ? {
                ...vehicle,
                services: vehicle.services.map(service =>
                  service.id === serviceId ? { ...service, ...updatedService } : service
                )
              }
            : vehicle
        ),
        selectedVehicle: state.selectedVehicle?.id === vehicleId
          ? {
              ...state.selectedVehicle,
              services: state.selectedVehicle.services.map(service =>
                service.id === serviceId ? { ...service, ...updatedService } : service
              )
            }
          : state.selectedVehicle
      })),
      removeService: (vehicleId, serviceId) => set((state) => ({
        vehicles: state.vehicles.map(vehicle => 
          vehicle.id === vehicleId 
            ? {
                ...vehicle,
                services: vehicle.services.filter(service => service.id !== serviceId)
              }
            : vehicle
        ),
        selectedVehicle: state.selectedVehicle?.id === vehicleId
          ? {
              ...state.selectedVehicle,
              services: state.selectedVehicle.services.filter(service => service.id !== serviceId)
            }
          : state.selectedVehicle
      })),
      
      // Loading states
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading })
    }),
    {
      name: 'carcare-storage',
      partialize: (state) => ({ 
        user: state.user,
        selectedVehicle: state.selectedVehicle 
      })
    }
  )
)