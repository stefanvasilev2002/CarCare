'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Car, Plus, Search } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { VehicleCard } from '@/components/vehicle-card'
import { useAuth } from '@/contexts/auth-context'
import { useAppStore } from '@/store'

export default function VehiclesPage() {
  const { user } = useAuth()
  const { vehicles, setVehicles } = useAppStore()
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  const fetchVehicles = useCallback(async () => {
    if (!user?.id) return
    try {
      const response = await fetch(`/api/vehicles?userId=${user.id}`)
      if (response.ok) {
        const vehiclesData = await response.json()
        setVehicles(vehiclesData)
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    } finally {
      setLoading(false)
    }
  }, [user?.id, setVehicles])

  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  const filteredVehicles = vehicles.filter(vehicle =>
    `${vehicle.year} ${vehicle.make} ${vehicle.model}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.plateNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleViewDetails = (vehicleId: string) => {
    router.push(`/vehicles/${vehicleId}`)
  }

  const handleEdit = (vehicleId: string) => {
    router.push(`/vehicles/${vehicleId}/edit`)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Vehicles</h1>
          <p className="text-gray-600">Manage your vehicle fleet and maintenance records.</p>
        </div>
        <Link href="/vehicles/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search vehicles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Vehicles Grid */}
      {filteredVehicles.length === 0 ? (
        <div className="text-center py-12">
          <Car className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {searchTerm ? 'No vehicles found' : 'No vehicles'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm 
              ? 'Try adjusting your search criteria.' 
              : 'Get started by adding your first vehicle.'
            }
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <Link href="/vehicles/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vehicle
                </Button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onViewDetails={() => handleViewDetails(vehicle.id)}
              onEdit={() => handleEdit(vehicle.id)}
            />
          ))}
        </div>
      )}

      {/* Stats */}
      {vehicles.length > 0 && (
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Fleet Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{vehicles.length}</div>
              <div className="text-sm text-gray-500">Total Vehicles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {vehicles.reduce((sum, v) => sum + v.services.length, 0)}
              </div>
              <div className="text-sm text-gray-500">Total Services</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                ${vehicles.reduce((sum, v) => 
                  sum + v.services.reduce((serviceSum, s) => serviceSum + s.cost, 0), 0
                ).toFixed(0)}
              </div>
              <div className="text-sm text-gray-500">Total Spent</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}