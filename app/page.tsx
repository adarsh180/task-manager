'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dashboard } from '@/components/dashboard'
import { LandingPage } from '@/components/landing-page'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')

    if (!token || !user) {
      setIsAuthenticated(false)
      setIsLoading(false)
      return
    }

    try {
      const userData = JSON.parse(user)
      if (userData && userData.id) {
        setIsAuthenticated(true)
      } else {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setIsAuthenticated(false)
      }
    } catch (error) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return isAuthenticated ? <Dashboard /> : <LandingPage />
}