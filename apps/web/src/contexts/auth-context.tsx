'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useAppStore } from '@/store'
import { seedDatabase } from '@/lib/seed'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name?: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo user for development
const DEMO_USER = {
  id: 'demo-user',
  email: 'demo@carcare.com',
  user_metadata: { name: 'Demo User' },
  created_at: new Date().toISOString()
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { setUser: setStoreUser } = useAppStore()

  useEffect(() => {
    // Check for demo mode or try Supabase
    const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                      process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://demo.supabase.co'

    if (isDemoMode) {
      // Auto-login with demo user for development
      const demoUser = DEMO_USER as unknown as User
      setUser(demoUser)
      setStoreUser({
        id: demoUser.id,
        email: demoUser.email || 'demo@carcare.com',
        name: demoUser.user_metadata?.name || null,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      // Seed the database with sample data
      seedDatabase(demoUser.id).catch(console.error)
      setLoading(false)
    } else {
      // Try real Supabase auth
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          setStoreUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name || null,
            createdAt: new Date(session.user.created_at),
            updatedAt: new Date()
          })
          // Seed the database with sample data for new users
          seedDatabase(session.user.id).catch(console.error)
        }
        setLoading(false)
      })

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          setStoreUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name || null,
            createdAt: new Date(session.user.created_at),
            updatedAt: new Date()
          })
          // Seed the database with sample data for new users
          if (event === 'SIGNED_IN') {
            seedDatabase(session.user.id).catch(console.error)
          }
        } else {
          setStoreUser(null)
        }
        setLoading(false)
      })

      return () => subscription.unsubscribe()
    }
  }, [setStoreUser])

  const signIn = async (email: string, password: string) => {
    const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                      process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://demo.supabase.co'

    if (isDemoMode) {
      // Demo login - accept any email/password
      if (email && password) {
        const demoUser = { ...DEMO_USER, email } as unknown as User
        setUser(demoUser)
                  setStoreUser({
            id: demoUser.id,
            email: demoUser.email || 'demo@carcare.com',
            name: demoUser.user_metadata?.name || null,
            createdAt: new Date(),
            updatedAt: new Date()
          })
      } else {
        throw new Error('Please enter email and password')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    }
  }

  const signUp = async (email: string, password: string, name?: string) => {
    const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                      process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://demo.supabase.co'

    if (isDemoMode) {
      // Demo signup - just sign them in
      await signIn(email, password)
      // Seed database for new demo user
      if (user?.id) {
        seedDatabase(user.id).catch(console.error)
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || ''
          }
        }
      })
      if (error) throw error
    }
  }

  const signOut = async () => {
    const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                      process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://demo.supabase.co'

    if (isDemoMode) {
      setUser(null)
      setStoreUser(null)
    } else {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}