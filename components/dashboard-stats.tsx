'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { 
  CheckCircle, 
  Clock, 
  Target, 
  TrendingUp,
  Calendar,
  BookOpen,
  Timer,
  Award
} from 'lucide-react'

interface DashboardStatsProps {
  onUpdate: () => void
}

export function DashboardStats({ onUpdate }: DashboardStatsProps) {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    totalNotes: 0,
    pomodoroSessions: 0,
    completionRate: 0,
    todayTasks: 0,
    weeklyGoal: 20
  })

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const [tasksRes, notesRes, pomodoroRes] = await Promise.all([
        fetch('/api/tasks', { headers }),
        fetch('/api/notes', { headers }),
        fetch('/api/pomodoro', { headers })
      ])

      const [tasks, notes, pomodoro] = await Promise.all([
        tasksRes.json(),
        notesRes.json(),
        pomodoroRes.json()
      ])

      const completedTasks = tasks.filter((t: any) => t.status === 'COMPLETED').length
      const inProgressTasks = tasks.filter((t: any) => t.status === 'IN_PROGRESS').length
      const todayTasks = tasks.filter((t: any) => {
        const today = new Date().toDateString()
        return new Date(t.createdAt).toDateString() === today
      }).length

      setStats({
        totalTasks: tasks.length,
        completedTasks,
        inProgressTasks,
        totalNotes: notes.length,
        pomodoroSessions: pomodoro.length,
        completionRate: tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0,
        todayTasks,
        weeklyGoal: 20
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [onUpdate])

  const getChangePercentage = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? '+100%' : '0%'
    const change = ((current - previous) / previous) * 100
    return change >= 0 ? `+${Math.round(change)}%` : `${Math.round(change)}%`
  }

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.totalTasks,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: stats.totalTasks > 0 ? `${stats.totalTasks} created` : '0%'
    },
    {
      title: 'Completed',
      value: stats.completedTasks,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: stats.completedTasks > 0 ? `${stats.completedTasks} done` : '0%'
    },
    {
      title: 'In Progress',
      value: stats.inProgressTasks,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: stats.inProgressTasks > 0 ? `${stats.inProgressTasks} active` : '0%'
    },
    {
      title: 'Notes Created',
      value: stats.totalNotes,
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: stats.totalNotes > 0 ? `${stats.totalNotes} notes` : '0%'
    },
    {
      title: 'Pomodoro Sessions',
      value: stats.pomodoroSessions,
      icon: Timer,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      change: stats.pomodoroSessions > 0 ? `${stats.pomodoroSessions} sessions` : '0%'
    },
    {
      title: 'Today\'s Tasks',
      value: stats.todayTasks,
      icon: Calendar,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      change: stats.todayTasks > 0 ? `${stats.todayTasks} today` : '0%'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.value > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    ) : (
                      <div className="h-4 w-4 mr-1" />
                    )}
                    <span className={`text-sm ${stat.value > 0 ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-primary" />
              <span>Task Completion Rate</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Overall Progress</span>
                <span className="text-2xl font-bold text-primary">{stats.completionRate}%</span>
              </div>
              <Progress value={stats.completionRate} className="h-3" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{stats.completedTasks} completed</span>
                <span>{stats.totalTasks} total</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Goal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <span>Weekly Goal</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tasks This Week</span>
                <span className="text-2xl font-bold text-primary">
                  {stats.completedTasks}/{stats.weeklyGoal}
                </span>
              </div>
              <Progress 
                value={(stats.completedTasks / stats.weeklyGoal) * 100} 
                className="h-3" 
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{Math.max(0, stats.weeklyGoal - stats.completedTasks)} remaining</span>
                <span>{Math.round((stats.completedTasks / stats.weeklyGoal) * 100)}% complete</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}