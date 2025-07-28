'use client'

import { useEffect, useState, useCallback } from 'react'
import { Car, DollarSign, Wrench, Calendar, Plus } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { VehicleCard } from '@/components/vehicle-card'
import { useAuth } from '@/contexts/auth-context'
import { useAppStore } from '@/store'
import { Service } from '@/types'

export default function DashboardPage() {
  const { user } = useAuth()
  const { vehicles, setVehicles } = useAppStore()
  const [loading, setLoading] = useState(true)
  const [recentServices, setRecentServices] = useState<Service[]>([])

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

  const fetchRecentServices = useCallback(async () => {
    if (!user?.id) return
    try {
      const response = await fetch(`/api/services?userId=${user.id}`)
      if (response.ok) {
        const servicesData = await response.json()
        setRecentServices(servicesData.slice(0, 5)) // Latest 5 services
      }
    } catch (error) {
      console.error('Error fetching recent services:', error)
    }
  }, [user?.id])

  useEffect(() => {
    fetchVehicles()
    fetchRecentServices()
  }, [fetchVehicles, fetchRecentServices])

  // Calculate stats
  const totalVehicles = vehicles.length
  const totalServices = vehicles.reduce((sum, vehicle) => sum + vehicle.services.length, 0)
  const totalCost = vehicles.reduce((sum, vehicle) => 
    sum + vehicle.services.reduce((serviceSum, service) => serviceSum + service.cost, 0), 0
  )
  const pendingReminders = vehicles.reduce((sum, vehicle) => 
    sum + vehicle.reminders.filter(r => !r.isCompleted).length, 0
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here&apos;s your vehicle maintenance overview.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/services/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </Link>
          <Link href="/vehicles/new">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Vehicle
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVehicles}</div>
            <p className="text-xs text-muted-foreground">
              Active vehicles in your fleet
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalServices}</div>
            <p className="text-xs text-muted-foreground">
              Maintenance records logged
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime maintenance costs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reminders</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReminders}</div>
            <p className="text-xs text-muted-foreground">
              Upcoming maintenance items
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vehicles */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Your Vehicles</CardTitle>
                <Link href="/vehicles">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {vehicles.length === 0 ? (
                <div className="text-center py-8">
                  <Car className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No vehicles</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by adding your first vehicle.
                  </p>
                  <div className="mt-6">
                    <Link href="/vehicles/new">
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Vehicle
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vehicles.slice(0, 4).map((vehicle) => (
                    <VehicleCard 
                      key={vehicle.id} 
                      vehicle={vehicle}
                      onViewDetails={() => {/* TODO: Navigate to vehicle details */}}
                      onEdit={() => {/* TODO: Navigate to edit vehicle */}}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Services */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Services</CardTitle>
                <Link href="/services">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentServices.length === 0 ? (
                <div className="text-center py-8">
                  <Wrench className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No services yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentServices.map((service) => (
                    <div key={service.id} className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">{service.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(service.serviceDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">${service.cost.toFixed(0)}</p>
                        <p className="text-xs text-gray-500">{service.provider}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}