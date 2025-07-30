"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Play, Pause, RotateCcw, Clock } from 'lucide-react'
import { formatTime } from '@/lib/utils'

interface PomodoroSession {
  id: string
  duration: number
  type: 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK'
  completedAt: string
}

interface PomodoroTimerProps {
  onUpdate: () => void
}

export function PomodoroTimer({ onUpdate }: PomodoroTimerProps) {
  const [workDuration, setWorkDuration] = useState(25)
  const [shortBreakDuration, setShortBreakDuration] = useState(5)
  const [longBreakDuration, setLongBreakDuration] = useState(15)
  const [currentType, setCurrentType] = useState<'WORK' | 'SHORT_BREAK' | 'LONG_BREAK'>('WORK')
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessions, setSessions] = useState<PomodoroSession[]>([])
  const [workSessionCount, setWorkSessionCount] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const getTimerSettings = () => ({
    WORK: workDuration * 60,
    SHORT_BREAK: shortBreakDuration * 60,
    LONG_BREAK: longBreakDuration * 60
  })

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/pomodoro', {
        headers: getAuthHeaders()
      })
      const data = await response.json()
      setSessions(data)
      
      // Count work sessions today
      const today = new Date().toDateString()
      const todaySessions = data.filter((s: PomodoroSession) => 
        new Date(s.completedAt).toDateString() === today && s.type === 'WORK'
      )
      setWorkSessionCount(todaySessions.length)
    } catch (error) {
      console.error('Failed to fetch sessions:', error)
    }
  }

  const saveSession = async () => {
    try {
      const response = await fetch('/api/pomodoro', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          duration: getTimerSettings()[currentType] / 60,
          type: currentType
        })
      })
      
      if (response.ok) {
        fetchSessions()
        onUpdate()
      }
    } catch (error) {
      console.error('Failed to save session:', error)
    }
  }

  const startTimer = () => {
    setIsRunning(true)
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false)
          saveSession()
          
          // Auto-switch to next session type
          if (currentType === 'WORK') {
            const nextType = (workSessionCount + 1) % 4 === 0 ? 'LONG_BREAK' : 'SHORT_BREAK'
            setCurrentType(nextType)
            setTimeLeft(getTimerSettings()[nextType])
          } else {
            setCurrentType('WORK')
            setTimeLeft(getTimerSettings().WORK)
          }
          
          // Play notification sound (browser notification)
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`${currentType.replace('_', ' ')} session completed!`)
          }
          
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const pauseTimer = () => {
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const resetTimer = () => {
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setTimeLeft(getTimerSettings()[currentType])
  }

  const switchType = (type: 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK') => {
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setCurrentType(type)
    setTimeLeft(getTimerSettings()[type])
  }

  const progress = ((getTimerSettings()[currentType] - timeLeft) / getTimerSettings()[currentType]) * 100

  useEffect(() => {
    fetchSessions()
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-lg p-6 border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Pomodoro Timer</h2>
            <p className="text-muted-foreground mt-1">Focus with the Pomodoro Technique</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Sessions today: <span className="font-semibold text-foreground">{workSessionCount}</span>
            </div>
            <Button variant="outline" onClick={() => setShowSettings(!showSettings)}>
              Settings
            </Button>
          </div>
        </div>
      </div>

      {showSettings && (
        <Card>
          <CardHeader>
            <CardTitle>Timer Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Work Duration (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={workDuration}
                  onChange={(e) => setWorkDuration(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Short Break (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={shortBreakDuration}
                  onChange={(e) => setShortBreakDuration(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Long Break (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={longBreakDuration}
                  onChange={(e) => setLongBreakDuration(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Timer */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              {currentType.replace('_', ' ').toUpperCase()}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-8">
            <div className="relative">
              <div className="text-8xl md:text-9xl font-mono font-bold text-primary">
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')} remaining
              </div>
            </div>
            
            <div className="space-y-4">
              <Progress value={progress} className="w-full h-3" />
              <div className="text-sm text-muted-foreground">
                {Math.round(progress)}% complete
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {!isRunning ? (
                <Button onClick={startTimer} size="lg" className="w-full sm:w-auto">
                  <Play className="h-5 w-5 mr-2" />
                  Start Session
                </Button>
              ) : (
                <Button onClick={pauseTimer} size="lg" variant="outline" className="w-full sm:w-auto">
                  <Pause className="h-5 w-5 mr-2" />
                  Pause
                </Button>
              )}
              <Button onClick={resetTimer} size="lg" variant="outline" className="w-full sm:w-auto">
                <RotateCcw className="h-5 w-5 mr-2" />
                Reset
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Button
                variant={currentType === 'WORK' ? 'default' : 'outline'}
                onClick={() => switchType('WORK')}
                className="w-full"
              >
                Work ({workDuration}m)
              </Button>
              <Button
                variant={currentType === 'SHORT_BREAK' ? 'default' : 'outline'}
                onClick={() => switchType('SHORT_BREAK')}
                className="w-full"
              >
                Short Break ({shortBreakDuration}m)
              </Button>
              <Button
                variant={currentType === 'LONG_BREAK' ? 'default' : 'outline'}
                onClick={() => switchType('LONG_BREAK')}
                className="w-full"
              >
                Long Break ({longBreakDuration}m)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Session History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {sessions.slice(0, 10).map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {session.type.replace('_', ' ')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {session.duration} minutes
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(session.completedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
              
              {sessions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4" />
                  <p>No sessions completed yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}