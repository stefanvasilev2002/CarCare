'use client'

import { useEffect, useState, useCallback } from 'react'
import { Calendar, Plus, Car, Clock, CheckCircle, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/auth-context'
import { useAppStore } from '@/store'
import { Reminder, Vehicle } from '@/types'

export default function RemindersPage() {
  const { user } = useAuth()
  const { vehicles } = useAppStore()
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)

  const fetchReminders = useCallback(async () => {
    if (!user?.id) return
    try {
      // For now, we'll get reminders from vehicles since we don't have a separate API
      const allReminders = vehicles.flatMap(vehicle => 
        vehicle.reminders.map(reminder => ({
          ...reminder,
          vehicle: vehicle
        }))
      )
             setReminders(allReminders as (Reminder & { vehicle: Vehicle })[])
    } catch (error) {
      console.error('Error fetching reminders:', error)
    } finally {
      setLoading(false)
    }
  }, [user?.id, vehicles])

  useEffect(() => {
    fetchReminders()
  }, [fetchReminders])

  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId)
    if (!vehicle) return 'Unknown Vehicle'
    return `${vehicle.year} ${vehicle.make} ${vehicle.model}`
  }

  const isOverdue = (reminder: Reminder) => {
    if (reminder.dueDate) {
      return new Date(reminder.dueDate) < new Date()
    }
    if (reminder.dueMileage) {
      const vehicle = vehicles.find(v => v.id === reminder.vehicleId)
      return vehicle ? vehicle.mileage >= reminder.dueMileage : false
    }
    return false
  }

  const isDueSoon = (reminder: Reminder) => {
    if (reminder.dueDate) {
      const dueDate = new Date(reminder.dueDate)
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
      return dueDate <= thirtyDaysFromNow && dueDate >= new Date()
    }
    if (reminder.dueMileage) {
      const vehicle = vehicles.find(v => v.id === reminder.vehicleId)
      if (vehicle) {
        const mileageDiff = reminder.dueMileage - vehicle.mileage
        return mileageDiff <= 1000 && mileageDiff > 0
      }
    }
    return false
  }

  const activeReminders = reminders.filter(r => !r.isCompleted)
  const completedReminders = reminders.filter(r => r.isCompleted)
  const overdueReminders = activeReminders.filter(isOverdue)
  const dueSoonReminders = activeReminders.filter(isDueSoon)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
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
          <h1 className="text-3xl font-bold text-gray-900">Maintenance Reminders</h1>
          <p className="text-gray-600">Stay on top of your vehicle maintenance schedule.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/services/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reminders</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeReminders.length}</div>
            <p className="text-xs text-muted-foreground">Active reminders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueReminders.length}</div>
            <p className="text-xs text-muted-foreground">Need immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Soon</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{dueSoonReminders.length}</div>
            <p className="text-xs text-muted-foreground">Within 30 days or 1000 miles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedReminders.length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Reminders Sections */}
      {activeReminders.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No active reminders</h3>
              <p className="mt-1 text-sm text-gray-500">
                Great! All your maintenance is up to date.
              </p>
              <div className="mt-6">
                <Link href="/services/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Service Record
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Overdue Reminders */}
          {overdueReminders.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-red-700 mb-4 flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Overdue ({overdueReminders.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {overdueReminders.map((reminder) => (
                  <Card key={reminder.id} className="border-red-200 bg-red-50">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="destructive">Overdue</Badge>
                        <Car className="h-4 w-4 text-gray-500" />
                      </div>
                      <h3 className="font-semibold text-gray-900">{reminder.description}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {getVehicleInfo(reminder.vehicleId)}
                      </p>
                      <div className="text-sm text-gray-500 mt-2">
                        {reminder.dueDate && (
                          <p>Due: {new Date(reminder.dueDate).toLocaleDateString()}</p>
                        )}
                        {reminder.dueMileage && (
                          <p>Due at: {reminder.dueMileage.toLocaleString()} miles</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Due Soon Reminders */}
          {dueSoonReminders.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-yellow-700 mb-4 flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Due Soon ({dueSoonReminders.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dueSoonReminders.map((reminder) => (
                  <Card key={reminder.id} className="border-yellow-200 bg-yellow-50">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                          Due Soon
                        </Badge>
                        <Car className="h-4 w-4 text-gray-500" />
                      </div>
                      <h3 className="font-semibold text-gray-900">{reminder.description}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {getVehicleInfo(reminder.vehicleId)}
                      </p>
                      <div className="text-sm text-gray-500 mt-2">
                        {reminder.dueDate && (
                          <p>Due: {new Date(reminder.dueDate).toLocaleDateString()}</p>
                        )}
                        {reminder.dueMileage && (
                          <p>Due at: {reminder.dueMileage.toLocaleString()} miles</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Other Active Reminders */}
          {activeReminders.filter(r => !isOverdue(r) && !isDueSoon(r)).length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Upcoming ({activeReminders.filter(r => !isOverdue(r) && !isDueSoon(r)).length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeReminders
                  .filter(r => !isOverdue(r) && !isDueSoon(r))
                  .map((reminder) => (
                    <Card key={reminder.id}>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="outline">Scheduled</Badge>
                          <Car className="h-4 w-4 text-gray-500" />
                        </div>
                        <h3 className="font-semibold text-gray-900">{reminder.description}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {getVehicleInfo(reminder.vehicleId)}
                        </p>
                        <div className="text-sm text-gray-500 mt-2">
                          {reminder.dueDate && (
                            <p>Due: {new Date(reminder.dueDate).toLocaleDateString()}</p>
                          )}
                          {reminder.dueMileage && (
                            <p>Due at: {reminder.dueMileage.toLocaleString()} miles</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}