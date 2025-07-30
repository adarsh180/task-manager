"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface RedirectIfAuthenticatedProps {
  children: React.ReactNode
}

export function RedirectIfAuthenticated({ children }: RedirectIfAuthenticatedProps) {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')

    if (token && user) {
      try {
        const userData = JSON.parse(user)
        if (userData && userData.id) {
          console.log('User already authenticated, redirecting to dashboard')
          router.replace('/')
          return
        }
      } catch (error) {
        // Invalid user data, clear storage
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
  }, [router])

  return <>{children}</>
}