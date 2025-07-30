'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, TrendingUp } from 'lucide-react'

export function TimeTrackingChart() {
  const [timeData, setTimeData] = useState<any[]>([])
  const [totalTime, setTotalTime] = useState(0)

  const fetchTimeData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/time-entries', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const entries = await response.json()
        
        // Group by subject/task for last 7 days
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - (6 - i))
          return date
        })

        const subjectData: { [key: string]: number[] } = {}
        let total = 0

        entries.forEach((entry: any) => {
          const entryDate = new Date(entry.createdAt)
          const subject = entry.subject || entry.task?.subject || entry.task?.title || 'General'
          total += entry.duration

          if (!subjectData[subject]) {
            subjectData[subject] = new Array(7).fill(0)
          }

          const dayIndex = last7Days.findIndex(day => 
            day.toDateString() === entryDate.toDateString()
          )
          
          if (dayIndex !== -1) {
            subjectData[subject][dayIndex] += entry.duration
          }
        })

        const chartData = last7Days.map((date, index) => ({
          day: date.toLocaleDateString('en', { weekday: 'short' }),
          date: date.toDateString(),
          subjects: Object.keys(subjectData).map(subject => ({
            name: subject,
            time: subjectData[subject][index] || 0
          }))
        }))

        setTimeData(chartData)
        setTotalTime(total)
      }
    } catch (error) {
      console.error('Failed to fetch time data:', error)
      setTimeData([])
      setTotalTime(0)
    }
  }

  useEffect(() => {
    fetchTimeData()
    const interval = setInterval(fetchTimeData, 30000)
    return () => clearInterval(interval)
  }, [])

  const maxTime = Math.max(...timeData.flatMap(day => 
    day.subjects.map((s: any) => s.time)
  ), 1)

  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-primary" />
          <span>Time Spent on Tasks</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Enhanced Total Time Display */}
          <div className="text-center bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-8">
            <div className="text-5xl font-bold text-primary mb-2">
              {Math.floor(totalTime / 60)}h {totalTime % 60}m
            </div>
            <p className="text-lg text-muted-foreground mb-4">Total time this week</p>
            <div className="flex justify-center space-x-6 text-sm">
              <div className="text-center">
                <div className="text-2xl font-semibold text-blue-600">{Math.floor(totalTime / 420 * 100)}%</div>
                <div className="text-xs text-muted-foreground">Weekly Goal</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-green-600">{Math.floor(totalTime / 60 / 7 * 10) / 10}</div>
                <div className="text-xs text-muted-foreground">Avg/Day</div>
              </div>
            </div>
          </div>

          {/* Enhanced Chart with bigger bars */}
          <div className="space-y-6 bg-muted/20 rounded-xl p-6">
            {timeData.map((day, dayIndex) => (
              <div key={dayIndex} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold w-16">{day.day}</span>
                  <div className="flex-1 mx-6">
                    <div className="relative h-12 bg-muted rounded-xl overflow-hidden shadow-inner">
                      {day.subjects.map((subject: any, subjectIndex: number) => {
                        const width = (subject.time / maxTime) * 100
                        const left = day.subjects
                          .slice(0, subjectIndex)
                          .reduce((acc: number, s: any) => acc + (s.time / maxTime) * 100, 0)
                        
                        return subject.time > 0 ? (
                          <div
                            key={subjectIndex}
                            className="absolute top-0 h-full transition-all duration-700 flex items-center justify-center text-sm text-white font-semibold shadow-sm"
                            style={{
                              left: `${left}%`,
                              width: `${width}%`,
                              backgroundColor: colors[subjectIndex % colors.length],
                              borderRadius: '0.5rem'
                            }}
                          >
                            {subject.time >= 20 && `${Math.floor(subject.time / 60)}h${subject.time % 60 ? `${subject.time % 60}m` : ''}`}
                          </div>
                        ) : null
                      })}
                    </div>
                  </div>
                  <div className="text-right w-20">
                    <div className="text-lg font-semibold">
                      {Math.floor(day.subjects.reduce((acc: number, s: any) => acc + s.time, 0) / 60)}h{' '}
                      {day.subjects.reduce((acc: number, s: any) => acc + s.time, 0) % 60}m
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {day.subjects.filter((s: any) => s.time > 0).length} subjects
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Legend */}
          <div className="bg-card rounded-xl p-6 border">
            <h4 className="font-semibold mb-4 text-lg">Subject Breakdown</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from(new Set(timeData.flatMap(day => 
                day.subjects.filter((s: any) => s.time > 0).map((s: any) => s.name)
              ))).map((subject, index) => {
                const totalSubjectTime = timeData.reduce((acc, day) => 
                  acc + (day.subjects.find((s: any) => s.name === subject)?.time || 0), 0
                )
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full shadow-sm"
                        style={{ backgroundColor: colors[index % colors.length] }}
                      ></div>
                      <span className="font-medium">{subject}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {Math.floor(totalSubjectTime / 60)}h {totalSubjectTime % 60}m
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round((totalSubjectTime / totalTime) * 100)}%
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {timeData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-4" />
              <p>No time tracking data yet</p>
              <p className="text-sm">Start a Pomodoro session to track your time</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}