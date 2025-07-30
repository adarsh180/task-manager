'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  CheckSquare, 
  StickyNote, 
  Timer, 
  MessageCircle, 
  User, 
  Calendar,
  TrendingUp,
  Clock,
  Target,
  BookOpen
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { DashboardStats } from '@/components/dashboard-stats'
import { ActivityChart } from '@/components/activity-chart'
import { TimeTrackingChart } from '@/components/time-tracking-chart'

export function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [recentTasks, setRecentTasks] = useState<any[]>([])
  const [updateTrigger, setUpdateTrigger] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/auth/login')
      return
    }

    setUser(JSON.parse(userData))
    fetchRecentTasks()
    
    // Listen for Pomodoro updates
    const handlePomodoroUpdate = () => {
      setUpdateTrigger(prev => prev + 1)
    }
    
    window.addEventListener('pomodoroUpdate', handlePomodoroUpdate)
    
    return () => {
      window.removeEventListener('pomodoroUpdate', handlePomodoroUpdate)
    }
  }, [updateTrigger])

  const fetchRecentTasks = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const tasks = await response.json()
      setRecentTasks(tasks.slice(0, 5))
    } catch (error) {
      console.error('Failed to fetch recent tasks:', error)
    }
  }

  const triggerUpdate = () => {
    setUpdateTrigger(prev => prev + 1)
  }
  
  // Auto-refresh dashboard every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setUpdateTrigger(prev => prev + 1)
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600 bg-green-50'
      case 'IN_PROGRESS': return 'text-orange-600 bg-orange-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-red-600'
      case 'HIGH': return 'text-orange-600'
      case 'MEDIUM': return 'text-yellow-600'
      default: return 'text-green-600'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 border animate-slide-up">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-muted-foreground text-lg">
              Ready to boost your {user?.examType} preparation? Let's make today productive!
            </p>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="mb-8 animate-scale-in">
          <DashboardStats onUpdate={triggerUpdate} />
        </div>

        {/* Charts Section - Much Bigger */}
        <div className="space-y-8 mb-8 animate-fade-in">
          {/* Activity Chart - Full Width */}
          <div className="animate-slide-up">
            <ActivityChart />
          </div>
          
          {/* Time Tracking Chart - Full Width */}
          <div className="animate-slide-up">
            <TimeTrackingChart />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Recent Tasks */}
        <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>Recent Tasks</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTasks.length > 0 ? (
                  recentTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm truncate">{task.title}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                            {task.status.replace('_', ' ')}
                          </span>
                          <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm text-center py-4">
                    No recent tasks
                  </p>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => router.push('/tasks')}
                >
                  View All Tasks
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => router.push('/tasks')}
              >
                <CheckSquare className="h-6 w-6" />
                <span>Manage Tasks</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => router.push('/notes')}
              >
                <BookOpen className="h-6 w-6" />
                <span>Take Notes</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => router.push('/pomodoro')}
              >
                <Timer className="h-6 w-6" />
                <span>Start Timer</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => router.push('/chat')}
              >
                <MessageCircle className="h-6 w-6" />
                <span>AI Assistant</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}