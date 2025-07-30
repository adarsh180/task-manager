'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { EnhancedPomodoroTimer } from '@/components/enhanced-pomodoro-timer'
import { Navbar } from '@/components/navbar'

export default function PomodoroPage() {
  const [updateTrigger, setUpdateTrigger] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
    }
  }, [])

  const handleUpdate = () => {
    setUpdateTrigger(prev => prev + 1)
    // Trigger dashboard update if needed
    window.dispatchEvent(new CustomEvent('pomodoroUpdate'))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EnhancedPomodoroTimer onUpdate={handleUpdate} />
      </main>
    </div>
  )
}