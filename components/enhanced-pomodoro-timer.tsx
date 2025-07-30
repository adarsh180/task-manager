'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Play, Pause, RotateCcw, Clock, Timer as TimerIcon } from 'lucide-react'
import { formatTime } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'

interface Task {
  id: string
  title: string
  subject?: string
}

interface EnhancedPomodoroTimerProps {
  onUpdate: () => void
  selectedTask?: Task | null
}

export function EnhancedPomodoroTimer({ onUpdate, selectedTask }: EnhancedPomodoroTimerProps) {
  const [workDuration, setWorkDuration] = useState(25)
  const [shortBreakDuration, setShortBreakDuration] = useState(5)
  const [longBreakDuration, setLongBreakDuration] = useState(15)
  const [currentType, setCurrentType] = useState<'WORK' | 'SHORT_BREAK' | 'LONG_BREAK'>('WORK')
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessions, setSessions] = useState<any[]>([])
  const [workSessionCount, setWorkSessionCount] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [studySubject, setStudySubject] = useState('')
  const [studyTopic, setStudyTopic] = useState('')
  const [studySubtopic, setStudySubtopic] = useState('')
  const [showSubjectForm, setShowSubjectForm] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const searchParams = useSearchParams()
  const [user, setUser] = useState<any>(null)

  const getExamSubjects = (examType: string) => {
    const subjects = {
      'UPSC': ['History', 'Geography', 'Polity', 'Economics', 'Environment', 'Current Affairs', 'Ethics', 'Public Administration'],
      'NEET_UG': ['Physics', 'Chemistry', 'Biology', 'Zoology', 'Botany', 'Organic Chemistry', 'Inorganic Chemistry'],
      'IIT_JEE': ['Mathematics', 'Physics', 'Chemistry', 'Calculus', 'Algebra', 'Mechanics', 'Thermodynamics'],
      'CSIR_UGC_NET': ['Life Sciences', 'Physical Sciences', 'Chemical Sciences', 'Mathematical Sciences', 'Earth Sciences'],
      'NEET_PG': ['Internal Medicine', 'Surgery', 'Pediatrics', 'Gynecology', 'Pathology', 'Pharmacology', 'Anatomy'],
      'CODING': ['Data Structures', 'Algorithms', 'System Design', 'Database', 'Operating Systems', 'Networks'],
      'DSA': ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming', 'Sorting', 'Searching'],
      'AI_ML': ['Machine Learning', 'Deep Learning', 'Neural Networks', 'Computer Vision', 'NLP', 'Statistics']
    }
    return subjects[examType as keyof typeof subjects] || ['Mathematics', 'Science', 'English', 'General Studies']
  }

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  const getTimerSettings = () => ({
    WORK: workDuration * 60,
    SHORT_BREAK: shortBreakDuration * 60,
    LONG_BREAK: longBreakDuration * 60
  })

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/pomodoro', {
        headers: getAuthHeaders()
      })
      const data = await response.json()
      setSessions(data)
      
      const today = new Date().toDateString()
      const todaySessions = data.filter((s: any) => 
        new Date(s.completedAt).toDateString() === today && s.type === 'WORK'
      )
      setWorkSessionCount(todaySessions.length)
    } catch (error) {
      console.error('Failed to fetch sessions:', error)
    }
  }

  const saveSession = async () => {
    try {
      const sessionData = {
        duration: getTimerSettings()[currentType] / 60,
        type: currentType,
        taskId: selectedTask?.id || null,
        subject: studySubject || 'General Study',
        topic: studyTopic || '',
        subtopic: studySubtopic || ''
      }

      const response = await fetch('/api/pomodoro', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(sessionData)
      })
      
      if (response.ok) {
        const sessionResult = await response.json()
        console.log('Session saved:', sessionResult)
        
        // Save time entry for work sessions
        if (currentType === 'WORK' && startTime) {
          try {
            await fetch('/api/time-entries', {
              method: 'POST',
              headers: getAuthHeaders(),
              body: JSON.stringify({
                taskId: selectedTask?.id || null,
                duration: getTimerSettings()[currentType] / 60,
                startTime: startTime.toISOString(),
                endTime: new Date().toISOString(),
                subject: studySubject || 'General Study',
                topic: studyTopic || '',
                subtopic: studySubtopic || ''
              })
            })
          } catch (timeError) {
            console.error('Failed to save time entry:', timeError)
          }
        }
        
        await fetchSessions()
        onUpdate()
      } else {
        console.error('Failed to save session:', await response.text())
      }
    } catch (error) {
      console.error('Failed to save session:', error)
    }
  }

  const startTimer = () => {
    if (currentType === 'WORK' && !studySubject) {
      setShowSubjectForm(true)
      return
    }
    setIsRunning(true)
    setStartTime(new Date())
    setShowSubjectForm(false)
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false)
          saveSession()
          
          if (currentType === 'WORK') {
            const nextType = (workSessionCount + 1) % 4 === 0 ? 'LONG_BREAK' : 'SHORT_BREAK'
            setCurrentType(nextType)
            setTimeLeft(getTimerSettings()[nextType])
          } else {
            setCurrentType('WORK')
            setTimeLeft(getTimerSettings().WORK)
          }
          
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
    setStartTime(null)
  }

  const switchType = (type: 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK') => {
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setCurrentType(type)
    setTimeLeft(getTimerSettings()[type])
    setStartTime(null)
  }

  const progress = ((getTimerSettings()[currentType] - timeLeft) / getTimerSettings()[currentType]) * 100

  useEffect(() => {
    fetchSessions()
    
    // Get user data
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    
    // Check URL parameters for task and subject
    const taskId = searchParams.get('task')
    const subject = searchParams.get('subject')
    
    if (subject) {
      setStudySubject(subject)
    }
    
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [searchParams])

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-lg p-6 border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Enhanced Pomodoro Timer</h2>
            <p className="text-muted-foreground mt-1">
              {studySubject ? `Studying: ${studySubject}${studyTopic ? ` - ${studyTopic}` : ''}${studySubtopic ? ` (${studySubtopic})` : ''}` : 'Focus with the Pomodoro Technique'}
            </p>
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
                <label className="text-sm font-medium">Work Duration</label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    type="number"
                    min="1"
                    max="480"
                    value={workDuration}
                    onChange={(e) => setWorkDuration(Number(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">
                    {workDuration >= 60 ? `${Math.floor(workDuration / 60)}h ${workDuration % 60}m` : `${workDuration}m`}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Short Break</label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    type="number"
                    min="1"
                    max="60"
                    value={shortBreakDuration}
                    onChange={(e) => setShortBreakDuration(Number(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">{shortBreakDuration}m</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Long Break</label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    type="number"
                    min="1"
                    max="120"
                    value={longBreakDuration}
                    onChange={(e) => setLongBreakDuration(Number(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">
                    {longBreakDuration >= 60 ? `${Math.floor(longBreakDuration / 60)}h ${longBreakDuration % 60}m` : `${longBreakDuration}m`}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subject Selection Form */}
      {showSubjectForm && (
        <Card>
          <CardHeader>
            <CardTitle>What are you studying?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Subject *</label>
                <Input
                  placeholder={`e.g., ${getExamSubjects(user?.examType || 'UPSC').slice(0, 2).join(', ')}`}
                  value={studySubject}
                  onChange={(e) => setStudySubject(e.target.value)}
                  list="subjects"
                />
                <datalist id="subjects">
                  {getExamSubjects(user?.examType || 'UPSC').map((subject, index) => (
                    <option key={index} value={subject} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Topic</label>
                <Input
                  placeholder={user?.examType === 'UPSC' ? 'e.g., Ancient India, Constitution' : user?.examType === 'IIT_JEE' ? 'e.g., Calculus, Mechanics' : 'e.g., Topic name'}
                  value={studyTopic}
                  onChange={(e) => setStudyTopic(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Subtopic</label>
                <Input
                  placeholder={user?.examType === 'UPSC' ? 'e.g., Mauryan Empire, Fundamental Rights' : user?.examType === 'IIT_JEE' ? 'e.g., Integration, Kinematics' : 'e.g., Subtopic name'}
                  value={studySubtopic}
                  onChange={(e) => setStudySubtopic(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => {
                  if (studySubject) {
                    setIsRunning(true)
                    setStartTime(new Date())
                    setShowSubjectForm(false)
                    intervalRef.current = setInterval(() => {
                      setTimeLeft((prev) => {
                        if (prev <= 1) {
                          setIsRunning(false)
                          saveSession()
                          
                          if (currentType === 'WORK') {
                            const nextType = (workSessionCount + 1) % 4 === 0 ? 'LONG_BREAK' : 'SHORT_BREAK'
                            setCurrentType(nextType)
                            setTimeLeft(getTimerSettings()[nextType])
                          } else {
                            setCurrentType('WORK')
                            setTimeLeft(getTimerSettings().WORK)
                          }
                          
                          if ('Notification' in window && Notification.permission === 'granted') {
                            new Notification(`${currentType.replace('_', ' ')} session completed!`)
                          }
                          
                          return 0
                        }
                        return prev - 1
                      })
                    }, 1000)
                  }
                }}
                disabled={!studySubject}
              >
                Start Studying
              </Button>
              <Button variant="outline" onClick={() => setShowSubjectForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
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
                Work ({workDuration >= 60 ? `${Math.floor(workDuration / 60)}h` : `${workDuration}m`})
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
                Long Break ({longBreakDuration >= 60 ? `${Math.floor(longBreakDuration / 60)}h` : `${longBreakDuration}m`})
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {Array.isArray(sessions) && sessions.slice(0, 10).map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <TimerIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {session.type.replace('_', ' ')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {session.duration >= 60 ? `${Math.floor(session.duration / 60)}h ${session.duration % 60}m` : `${session.duration}m`}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(session.completedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
              
              {Array.isArray(sessions) && sessions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4" />
                  <p>No sessions completed yet</p>
                </div>
              )}
              
              {!Array.isArray(sessions) && (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4" />
                  <p>Loading sessions...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}