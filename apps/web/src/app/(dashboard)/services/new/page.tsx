'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Loader2, Wrench } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/auth-context'
import { useAppStore } from '@/store'
import { ServiceType } from '@/types'

const serviceSchema = z.object({
  vehicleId: z.string().min(1, 'Please select a vehicle'),
  type: z.nativeEnum({
    OIL_CHANGE: 'OIL_CHANGE',
    TIRE_ROTATION: 'TIRE_ROTATION',
    BRAKE_SERVICE: 'BRAKE_SERVICE',
    ENGINE_TUNE_UP: 'ENGINE_TUNE_UP',
    TRANSMISSION: 'TRANSMISSION',
    BATTERY: 'BATTERY',
    INSPECTION: 'INSPECTION',
    REGISTRATION: 'REGISTRATION',
    OTHER: 'OTHER',
  } as const, 'Please select a service type'),
  description: z.string().min(1, 'Description is required'),
  cost: z.number().min(0, 'Cost must be 0 or greater'),
  mileage: z.number().min(0, 'Mileage must be 0 or greater'),
  serviceDate: z.string().min(1, 'Service date is required'),
  provider: z.string().min(1, 'Service provider is required'),
  location: z.string().optional(),
  notes: z.string().optional(),
})

type ServiceFormData = z.infer<typeof serviceSchema>

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

export default function NewServicePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const { vehicles, addService } = useAppStore()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      serviceDate: new Date().toISOString().split('T')[0],
      cost: 0,
      mileage: 0,
    }
  })

  const selectedVehicleId = watch('vehicleId')
  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId)

  useEffect(() => {
    if (selectedVehicle) {
      setValue('mileage', selectedVehicle.mileage)
    }
  }, [selectedVehicle, setValue])

  const onSubmit = async (data: ServiceFormData) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          userId: user?.id,
          serviceDate: new Date(data.serviceDate).toISOString(),
        }),
      })

      if (response.ok) {
        const newService = await response.json()
        addService(data.vehicleId, newService)
        router.push('/services')
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create service record')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (vehicles.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/services">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Services
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add Service Record</h1>
          </div>
        </div>

        <Card className="max-w-2xl">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Wrench className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No vehicles found</h3>
              <p className="mt-1 text-sm text-gray-500">
                You need to add a vehicle before you can create service records.
              </p>
              <div className="mt-6">
                <Link href="/vehicles/new">
                  <Button>Add Your First Vehicle</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/services">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Service Record</h1>
          <p className="text-gray-600">Log a new maintenance or service record.</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wrench className="mr-2 h-5 w-5" />
              Service Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Vehicle Selection */}
              <div>
                <Label htmlFor="vehicleId">Vehicle *</Label>
                <Select onValueChange={(value) => setValue('vehicleId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.year} {vehicle.make} {vehicle.model}
                        {vehicle.plateNumber && ` (${vehicle.plateNumber})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.vehicleId && (
                  <p className="text-sm text-red-600 mt-1">{errors.vehicleId.message}</p>
                )}
              </div>

              {/* Service Type */}
              <div>
                <Label htmlFor="type">Service Type *</Label>
                <Select onValueChange={(value) => setValue('type', value as ServiceType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(serviceTypeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-600 mt-1">{errors.type.message}</p>
                )}
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="serviceDate">Service Date *</Label>
                  <Input
                    id="serviceDate"
                    type="date"
                    {...register('serviceDate')}
                  />
                  {errors.serviceDate && (
                    <p className="text-sm text-red-600 mt-1">{errors.serviceDate.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="cost">Cost *</Label>
                  <Input
                    id="cost"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    {...register('cost', { valueAsNumber: true })}
                  />
                  {errors.cost && (
                    <p className="text-sm text-red-600 mt-1">{errors.cost.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="mileage">Mileage at Service *</Label>
                  <Input
                    id="mileage"
                    type="number"
                    min="0"
                    placeholder="Current mileage"
                    {...register('mileage', { valueAsNumber: true })}
                  />
                  {errors.mileage && (
                    <p className="text-sm text-red-600 mt-1">{errors.mileage.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="provider">Service Provider *</Label>
                  <Input
                    id="provider"
                    placeholder="e.g., Joe's Auto Shop"
                    {...register('provider')}
                  />
                  {errors.provider && (
                    <p className="text-sm text-red-600 mt-1">{errors.provider.message}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  placeholder="e.g., Oil change with synthetic oil"
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                )}
              </div>

              {/* Optional Fields */}
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., 123 Main St, City, State"
                  {...register('location')}
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes about the service..."
                  {...register('notes')}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-6">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Service Record
                </Button>
                <Link href="/services">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}