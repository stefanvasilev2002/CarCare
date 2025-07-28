'use client'

import { Car, Calendar, DollarSign, Wrench } from 'lucide-react'
import { VehicleWithServices } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store'

interface VehicleCardProps {
  vehicle: VehicleWithServices
  onEdit?: () => void
  onViewDetails?: () => void
}

export function VehicleCard({ vehicle, onEdit, onViewDetails }: VehicleCardProps) {
  const { setSelectedVehicle, selectedVehicle } = useAppStore()

  const totalCost = vehicle.services.reduce((sum, service) => sum + service.cost, 0)
  const lastService = vehicle.services[0]
  const pendingReminders = vehicle.reminders.filter(r => !r.isCompleted).length

  const handleSelect = () => {
    setSelectedVehicle(vehicle)
  }

  const isSelected = selectedVehicle?.id === vehicle.id

  return (
    <Card className={`cursor-pointer transition-all hover:shadow-md ${
      isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
    }`} onClick={handleSelect}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </CardTitle>
          {isSelected && <Badge variant="secondary">Selected</Badge>}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Car className="mr-1 h-4 w-4" />
          {vehicle.mileage.toLocaleString()} miles
          {vehicle.plateNumber && ` • ${vehicle.plateNumber}`}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center mb-1">
              <Wrench className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-lg font-semibold">{vehicle.services.length}</div>
            <div className="text-xs text-gray-500">Services</div>
          </div>
          <div>
            <div className="flex items-center justify-center mb-1">
              <DollarSign className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-lg font-semibold">${totalCost.toFixed(0)}</div>
            <div className="text-xs text-gray-500">Total Cost</div>
          </div>
          <div>
            <div className="flex items-center justify-center mb-1">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-lg font-semibold">{pendingReminders}</div>
            <div className="text-xs text-gray-500">Reminders</div>
          </div>
        </div>

        {/* Last Service */}
        {lastService && (
          <div className="border-t pt-3">
            <p className="text-xs font-medium text-gray-500 mb-1">Last Service</p>
            <div className="flex justify-between items-center">
              <span className="text-sm">{lastService.description}</span>
              <span className="text-xs text-gray-500">
                {new Date(lastService.serviceDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation()
              onViewDetails?.()
            }}
          >
            View Details
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onEdit?.()
            }}
          >
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}