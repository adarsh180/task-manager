'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Activity } from 'lucide-react'

export function ActivityChart() {
  const [activityData, setActivityData] = useState<any[]>([])

  const fetchRealTimeData = async () => {
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

      // Group data by last 7 days
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (6 - i))
        return date
      })

      const data = last7Days.map(date => {
        const dayTasks = tasks.filter((t: any) => 
          new Date(t.createdAt).toDateString() === date.toDateString() && t.status === 'COMPLETED'
        ).length
        
        const dayNotes = notes.filter((n: any) => 
          new Date(n.createdAt).toDateString() === date.toDateString()
        ).length
        
        const dayPomodoro = pomodoro.filter((p: any) => 
          new Date(p.createdAt).toDateString() === date.toDateString()
        ).length

        return {
          day: date.toLocaleDateString('en', { weekday: 'short' }),
          tasks: dayTasks,
          pomodoro: dayPomodoro,
          notes: dayNotes,
          total: dayTasks + dayNotes + dayPomodoro
        }
      })

      setActivityData(data)
    } catch (error) {
      console.error('Failed to fetch activity data:', error)
      setActivityData(Array.from({ length: 7 }, (_, i) => ({
        day: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en', { weekday: 'short' }),
        tasks: 0,
        pomodoro: 0,
        notes: 0,
        total: 0
      })))
    }
  }

  useEffect(() => {
    fetchRealTimeData()
    const interval = setInterval(fetchRealTimeData, 30000)
    return () => clearInterval(interval)
  }, [])

  const maxValue = Math.max(...activityData.map(d => d.total), 1)
  const createPath = (data: number[]) => {
    if (data.length === 0) return ''
    const width = 800
    const height = 300
    const stepX = width / (data.length - 1)
    
    return data.map((value, index) => {
      const x = index * stepX
      const y = height - (value / maxValue) * height
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span>Weekly Progress</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Line Chart - Much Bigger */}
          <div className="relative bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl p-6">
            <svg viewBox="0 0 800 300" className="w-full h-80">
              {/* Enhanced Grid lines */}
              {[0, 50, 100, 150, 200, 250, 300].map(y => (
                <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
              ))}
              {[0, 100, 200, 300, 400, 500, 600, 700, 800].map(x => (
                <line key={x} x1={x} y1="0" x2={x} y2="300" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
              ))}
              
              {/* Area fills for better visualization */}
              <defs>
                <linearGradient id="tasksGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#fca5a5" stopOpacity="0.05" />
                </linearGradient>
                <linearGradient id="pomodoroGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.05" />
                </linearGradient>
                <linearGradient id="notesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#991b1b" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#991b1b" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              
              {/* Area fills */}
              <path
                d={`${createPath(activityData.map(d => d.tasks))} L 800 300 L 0 300 Z`}
                fill="url(#tasksGradient)"
                className="transition-all duration-500"
              />
              
              {/* Tasks line */}
              <path
                d={createPath(activityData.map(d => d.tasks))}
                fill="none"
                stroke="#fca5a5"
                strokeWidth="4"
                className="transition-all duration-500 drop-shadow-sm"
              />
              
              {/* Pomodoro line */}
              <path
                d={createPath(activityData.map(d => d.pomodoro))}
                fill="none"
                stroke="#ef4444"
                strokeWidth="4"
                className="transition-all duration-500 drop-shadow-sm"
              />
              
              {/* Notes line */}
              <path
                d={createPath(activityData.map(d => d.notes))}
                fill="none"
                stroke="#991b1b"
                strokeWidth="4"
                className="transition-all duration-500 drop-shadow-sm"
              />
              
              {/* Enhanced Data points with hover effects */}
              {activityData.map((day, index) => {
                const x = (index * 800) / (activityData.length - 1)
                return (
                  <g key={index}>
                    <circle cx={x} cy={300 - (day.tasks / maxValue) * 300} r="6" fill="#fca5a5" stroke="white" strokeWidth="3" className="drop-shadow-sm" />
                    <circle cx={x} cy={300 - (day.pomodoro / maxValue) * 300} r="6" fill="#ef4444" stroke="white" strokeWidth="3" className="drop-shadow-sm" />
                    <circle cx={x} cy={300 - (day.notes / maxValue) * 300} r="6" fill="#991b1b" stroke="white" strokeWidth="3" className="drop-shadow-sm" />
                    
                    {/* Value labels */}
                    {day.tasks > 0 && (
                      <text x={x} y={300 - (day.tasks / maxValue) * 300 - 15} textAnchor="middle" className="text-xs font-medium fill-current" opacity="0.8">
                        {day.tasks}
                      </text>
                    )}
                    {day.pomodoro > 0 && (
                      <text x={x + 15} y={300 - (day.pomodoro / maxValue) * 300 - 15} textAnchor="middle" className="text-xs font-medium fill-current" opacity="0.8">
                        {day.pomodoro}
                      </text>
                    )}
                    {day.notes > 0 && (
                      <text x={x - 15} y={300 - (day.notes / maxValue) * 300 - 15} textAnchor="middle" className="text-xs font-medium fill-current" opacity="0.8">
                        {day.notes}
                      </text>
                    )}
                  </g>
                )
              })}
            </svg>
          </div>
          
          {/* Days labels */}
          <div className="flex justify-between text-sm text-muted-foreground">
            {activityData.map((day, index) => (
              <span key={index}>{day.day}</span>
            ))}
          </div>
          
          {/* Enhanced Legend */}
          <div className="flex justify-center space-x-8 text-sm bg-muted/30 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 rounded-full shadow-sm" style={{backgroundColor: '#fca5a5'}}></div>
              <div className="flex flex-col">
                <span className="font-medium">Tasks Completed</span>
                <span className="text-xs text-muted-foreground">{activityData.reduce((sum, d) => sum + d.tasks, 0)} total</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 rounded-full shadow-sm" style={{backgroundColor: '#ef4444'}}></div>
              <div className="flex flex-col">
                <span className="font-medium">Pomodoro Sessions</span>
                <span className="text-xs text-muted-foreground">{activityData.reduce((sum, d) => sum + d.pomodoro, 0)} total</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 rounded-full shadow-sm" style={{backgroundColor: '#991b1b'}}></div>
              <div className="flex flex-col">
                <span className="font-medium">Notes Created</span>
                <span className="text-xs text-muted-foreground">{activityData.reduce((sum, d) => sum + d.notes, 0)} total</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}