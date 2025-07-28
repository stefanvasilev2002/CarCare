'use client'

import { User, Bell, Database, Shield, HelpCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'

export default function SettingsPage() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and application preferences.</p>
      </div>

      {/* User Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <p className="text-sm text-gray-900">{user?.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Name</label>
            <p className="text-sm text-gray-900">
              {user?.user_metadata?.name || 'Not set'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Member Since</label>
            <p className="text-sm text-gray-900">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Configure how you&apos;d like to receive maintenance reminders and updates.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>• Email notifications (Coming Soon)</p>
                <p>• Push notifications (Coming Soon)</p>
                <p>• SMS reminders (Coming Soon)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Manage your data and privacy settings.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>• Data export (Coming Soon)</p>
                <p>• Account deletion (Coming Soon)</p>
                <p>• Privacy controls (Coming Soon)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Import, export, and backup your vehicle data.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>• Import from CSV (Coming Soon)</p>
                <p>• Export data (Coming Soon)</p>
                <p>• Data backup (Coming Soon)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help & Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HelpCircle className="mr-2 h-5 w-5" />
              Help & Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Get help and support for using CarCare.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>• Documentation (Coming Soon)</p>
                <p>• Contact support (Coming Soon)</p>
                <p>• Feature requests (Coming Soon)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="sm:w-auto"
            >
              Sign Out
            </Button>
            <Button 
              variant="destructive" 
              disabled
              className="sm:w-auto"
            >
              Delete Account (Coming Soon)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}