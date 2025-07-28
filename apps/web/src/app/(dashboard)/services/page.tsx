'use client'

import { useEffect, useState, useCallback } from 'react'

import { Wrench, Plus, Search, Calendar, DollarSign, Car } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/contexts/auth-context'
import { useAppStore } from '@/store'
import { Service, ServiceType } from '@/types'

const serviceTypeLabels: Record<ServiceType, string> = {
  OIL_CHANGE: 'Oil Change',
  TIRE_ROTATION: 'Tire Rotation',
  BRAKE_SERVICE: 'Brake Service',
  ENGINE_TUNE_UP: 'Engine Tune-up',
  TRANSMISSION: 'Transmission Service',
  BATTERY: 'Battery Service',
  INSPECTION: 'Inspection',
  REGISTRATION: 'Registration',
  OTHER: 'Other',
}

export default function ServicesPage() {
  const { user } = useAuth()
  const { vehicles } = useAppStore()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedVehicle, setSelectedVehicle] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')

  const fetchServices = useCallback(async () => {
    if (!user?.id) return
    try {
      const response = await fetch(`/api/services?userId=${user.id}`)
      if (response.ok) {
        const servicesData = await response.json()
        setServices(servicesData)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serviceTypeLabels[service.type].toLowerCase().includes(searchTerm.toLowerCase())

    const matchesVehicle = selectedVehicle === 'all' || service.vehicleId === selectedVehicle
    const matchesType = selectedType === 'all' || service.type === selectedType

    return matchesSearch && matchesVehicle && matchesType
  })

  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId)
    if (!vehicle) return 'Unknown Vehicle'
    return `${vehicle.year} ${vehicle.make} ${vehicle.model}`
  }

  const totalCost = filteredServices.reduce((sum, service) => sum + service.cost, 0)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Records</h1>
          <p className="text-gray-600">Track all your vehicle maintenance and service history.</p>
        </div>
        <Link href="/services/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All vehicles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Vehicles</SelectItem>
            {vehicles.map((vehicle) => (
              <SelectItem key={vehicle.id} value={vehicle.id}>
                {vehicle.year} {vehicle.make} {vehicle.model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(serviceTypeLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary Stats */}
      {filteredServices.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Wrench className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{filteredServices.length}</p>
                  <p className="text-sm text-gray-500">Service Records</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">${totalCost.toFixed(0)}</p>
                  <p className="text-sm text-gray-500">Total Cost</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    ${(totalCost / filteredServices.length).toFixed(0)}
                  </p>
                  <p className="text-sm text-gray-500">Avg. Cost</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Services List */}
      {filteredServices.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Wrench className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {searchTerm || selectedVehicle !== 'all' || selectedType !== 'all' 
                  ? 'No services found' 
                  : 'No service records'
                }
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedVehicle !== 'all' || selectedType !== 'all'
                  ? 'Try adjusting your search or filters.' 
                  : 'Start by adding your first service record.'
                }
              </p>
              {!searchTerm && selectedVehicle === 'all' && selectedType === 'all' && (
                <div className="mt-6">
                  <Link href="/services/new">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Service Record
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredServices.map((service) => (
            <Card key={service.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline">
                        {serviceTypeLabels[service.type]}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(service.serviceDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {service.description}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Car className="h-4 w-4" />
                        {getVehicleInfo(service.vehicleId)}
                      </div>
                      <span>•</span>
                      <span>{service.provider}</span>
                      <span>•</span>
                      <span>{service.mileage.toLocaleString()} miles</span>
                    </div>
                    
                    {service.notes && (
                      <p className="text-sm text-gray-600 mt-2">{service.notes}</p>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      ${service.cost.toFixed(0)}
                    </div>
                    {service.location && (
                      <div className="text-sm text-gray-500">{service.location}</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}