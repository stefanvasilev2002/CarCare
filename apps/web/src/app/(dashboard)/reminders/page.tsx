'use client'

import { Calendar, Plus, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function RemindersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reminders</h1>
          <p className="text-gray-600">Stay on top of your vehicle maintenance schedule.</p>
        </div>
        <Button disabled>
          <Plus className="mr-2 h-4 w-4" />
          Add Reminder
        </Button>
      </div>

      {/* Coming Soon */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Maintenance Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-blue-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Smart Reminders Coming Soon
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              We&apos;re working on intelligent maintenance reminders based on mileage, 
              time intervals, and your service history. Stay tuned!
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <p>✓ Automatic oil change reminders</p>
              <p>✓ Tire rotation alerts</p>
              <p>✓ Inspection due dates</p>
              <p>✓ Custom maintenance schedules</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-medium text-gray-900 mb-2">Track More Services</h3>
              <p className="text-sm text-gray-500 mb-4">
                Add more service records to help us create better reminders for you.
              </p>
              <Link href="/services/new">
                <Button variant="outline">Add Service Record</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-medium text-gray-900 mb-2">Update Vehicle Info</h3>
              <p className="text-sm text-gray-500 mb-4">
                Keep your vehicle mileage up to date for accurate maintenance scheduling.
              </p>
              <Link href="/vehicles">
                <Button variant="outline">Manage Vehicles</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}