'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Loader2, Car } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/auth-context'
import { useAppStore } from '@/store'

const vehicleSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(1900, 'Enter a valid year').max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
  vin: z.string().optional(),
  mileage: z.number().min(0, 'Mileage must be 0 or greater'),
  color: z.string().optional(),
  plateNumber: z.string().optional(),
})

type VehicleFormData = z.infer<typeof vehicleSchema>

export default function NewVehiclePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const { addVehicle } = useAppStore()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      year: new Date().getFullYear(),
      mileage: 0,
    }
  })

  const onSubmit = async (data: VehicleFormData) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          userId: user?.id,
        }),
      })

      if (response.ok) {
        const newVehicle = await response.json()
        addVehicle(newVehicle)
        router.push('/vehicles')
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create vehicle')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/vehicles">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vehicles
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Vehicle</h1>
          <p className="text-gray-600">Add a vehicle to start tracking its maintenance.</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Car className="mr-2 h-5 w-5" />
              Vehicle Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="make">Make *</Label>
                  <Input
                    id="make"
                    placeholder="e.g., Toyota"
                    {...register('make')}
                  />
                  {errors.make && (
                    <p className="text-sm text-red-600 mt-1">{errors.make.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    placeholder="e.g., Camry"
                    {...register('model')}
                  />
                  {errors.model && (
                    <p className="text-sm text-red-600 mt-1">{errors.model.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    {...register('year', { valueAsNumber: true })}
                  />
                  {errors.year && (
                    <p className="text-sm text-red-600 mt-1">{errors.year.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="mileage">Current Mileage *</Label>
                  <Input
                    id="mileage"
                    type="number"
                    min="0"
                    placeholder="e.g., 50000"
                    {...register('mileage', { valueAsNumber: true })}
                  />
                  {errors.mileage && (
                    <p className="text-sm text-red-600 mt-1">{errors.mileage.message}</p>
                  )}
                </div>
              </div>

              {/* Optional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    placeholder="e.g., Blue"
                    {...register('color')}
                  />
                  {errors.color && (
                    <p className="text-sm text-red-600 mt-1">{errors.color.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="plateNumber">License Plate</Label>
                  <Input
                    id="plateNumber"
                    placeholder="e.g., ABC-123"
                    {...register('plateNumber')}
                  />
                  {errors.plateNumber && (
                    <p className="text-sm text-red-600 mt-1">{errors.plateNumber.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="vin">VIN (Vehicle Identification Number)</Label>
                <Input
                  id="vin"
                  placeholder="17-character VIN"
                  maxLength={17}
                  {...register('vin')}
                />
                {errors.vin && (
                  <p className="text-sm text-red-600 mt-1">{errors.vin.message}</p>
                )}
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
                  Add Vehicle
                </Button>
                <Link href="/vehicles">
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