'use client'

import { useState } from 'react'
import { User, Car, Bell, Shield, Database, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/auth-context'
import { useAppStore } from '@/store'

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const { vehicles } = useAppStore()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const totalServices = vehicles.reduce((sum, vehicle) => sum + vehicle.services.length, 0)
  const totalCost = vehicles.reduce((sum, vehicle) => 
    sum + vehicle.services.reduce((serviceSum, service) => serviceSum + service.cost, 0), 0
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and application preferences.</p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={user?.user_metadata?.name || 'Demo User'}
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user?.email || 'demo@carcare.com'}
                    disabled
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  Demo Mode
                </Badge>
                <p className="text-sm text-gray-500 mt-2">
                  You&apos;re currently using CarCare in demo mode. All data is stored locally and will reset when you refresh the page.
                </p>
              </div>

              <div className="pt-4 border-t">
                <Button 
                  variant="destructive" 
                  onClick={handleSignOut}
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing out...' : 'Sign Out'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Car className="mr-2 h-5 w-5" />
                Account Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{vehicles.length}</div>
                  <div className="text-sm text-gray-500">Vehicles</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{totalServices}</div>
                  <div className="text-sm text-gray-500">Service Records</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">${totalCost.toFixed(0)}</div>
                  <div className="text-sm text-gray-500">Total Spent</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <Bell className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Notifications Coming Soon</h3>
                <p className="mt-1 text-sm text-gray-500">
                  We&apos;re working on email and push notification preferences for maintenance reminders.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Display Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Currency</Label>
                <Input value="USD ($)" disabled />
                <p className="text-sm text-gray-500 mt-1">Currency format for costs and expenses</p>
              </div>
              <div>
                <Label>Distance Unit</Label>
                <Input value="Miles" disabled />
                <p className="text-sm text-gray-500 mt-1">Unit for mileage tracking</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Tab */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Export Data</h4>
                  <p className="text-sm text-gray-500 mb-2">
                    Download all your vehicle and service data as a JSON file.
                  </p>
                  <Button variant="outline" disabled>
                    Export Data (Coming Soon)
                  </Button>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium">Import Data</h4>
                  <p className="text-sm text-gray-500 mb-2">
                    Import vehicle and service data from a CSV or JSON file.
                  </p>
                  <Button variant="outline" disabled>
                    Import Data (Coming Soon)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-medium text-green-800">Your data is secure</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  In demo mode, all data is stored locally in your browser. No personal information is sent to external servers.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Data Storage</h4>
                <p className="text-sm text-gray-500">
                  • Vehicle information is stored locally
                  <br />
                  • Service records are encrypted
                  <br />
                  • No third-party tracking
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Tab */}
        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="mr-2 h-5 w-5" />
                About CarCare
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">Version</h4>
                <p className="text-sm text-gray-500">Demo v1.0.0</p>
              </div>
              
              <div>
                <h4 className="font-medium">Features</h4>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Vehicle management</li>
                  <li>• Service record tracking</li>
                  <li>• Maintenance reminders</li>
                  <li>• Cost analytics</li>
                  <li>• Export/import data</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium">Built With</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">Next.js 15</Badge>
                  <Badge variant="outline">TypeScript</Badge>
                  <Badge variant="outline">Prisma</Badge>
                  <Badge variant="outline">Tailwind CSS</Badge>
                  <Badge variant="outline">shadcn/ui</Badge>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium">Contact</h4>
                <p className="text-sm text-gray-500">
                  This is a demo application. For questions or feedback, please reach out to the development team.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}