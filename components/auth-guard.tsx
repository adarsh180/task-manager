"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')

      console.log('AuthGuard - Token:', !!token, 'User:', !!user, 'Path:', pathname)

      if (!token || !user) {
        console.log('No token or user, redirecting to login')
        setIsAuthenticated(false)
        setIsLoading(false)
        if (pathname !== '/auth/login' && pathname !== '/auth/register') {
          router.replace('/auth/login')
        }
        return
      }

      // Verify token is still valid
      try {
        const userData = JSON.parse(user)
        if (userData && userData.id) {
          console.log('User authenticated:', userData.name)
          setIsAuthenticated(true)
        } else {
          console.log('Invalid user data')
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setIsAuthenticated(false)
          router.replace('/auth/login')
        }
      } catch (error) {
        console.log('Error parsing user data:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setIsAuthenticated(false)
        router.replace('/auth/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}