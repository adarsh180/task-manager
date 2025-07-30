"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Edit, Trash2, CheckCircle, Timer } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Task {
  id: string
  title: string
  description?: string
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate?: string
  createdAt: string
}

interface TaskManagerProps {
  onUpdate: () => void
}

export function TaskManager({ onUpdate }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as const,
    dueDate: '',
    subject: ''
  })

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks', {
        headers: getAuthHeaders()
      })
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    }
  }

  const createTask = async () => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        setFormData({ title: '', description: '', priority: 'MEDIUM', dueDate: '', subject: '' })
        setIsCreating(false)
        fetchTasks()
        onUpdate()
      }
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      })
      
      if (response.ok) {
        fetchTasks()
        onUpdate()
      }
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const deleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders()
      })
      if (response.ok) {
        fetchTasks()
        onUpdate()
      }
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const toggleTaskStatus = (task: Task) => {
    const newStatus = task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED'
    updateTask(task.id, { status: newStatus })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-red-600'
      case 'HIGH': return 'text-orange-600'
      case 'MEDIUM': return 'text-yellow-600'
      case 'LOW': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 rounded-lg p-6 border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Task Manager</h2>
            <p className="text-muted-foreground mt-1">Organize and track your study tasks efficiently</p>
          </div>
          <Button onClick={() => setIsCreating(true)} size="lg" className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add New Task
          </Button>
        </div>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Task</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Task title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <Input
              placeholder="Subject (e.g., Mathematics, Physics)"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />
            <Textarea
              placeholder="Task description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <div className="flex gap-4">
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={createTask}>Create Task</Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:gap-6">
        {Array.isArray(tasks) && tasks.map((task) => (
          <Card key={task.id} className={`hover:shadow-lg transition-all duration-200 border-l-4 ${
            task.status === 'COMPLETED' ? 'opacity-60 border-l-green-400' : 'border-l-primary/20'
          }`}>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleTaskStatus(task)}
                        className="p-1"
                      >
                        <CheckCircle className={`h-5 w-5 ${task.status === 'COMPLETED' ? 'text-green-600' : 'text-gray-400'}`} />
                      </Button>
                      <h3 className={`font-semibold text-lg ${task.status === 'COMPLETED' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {task.title}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-2 lg:hidden">
                      <Button variant="outline" size="sm" onClick={() => router.push(`/pomodoro?task=${task.id}&subject=${task.title}`)} title="Start Pomodoro">
                        <Timer className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setEditingTask(task)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => deleteTask(task.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {task.description && (
                    <p className="text-muted-foreground leading-relaxed ml-8">{task.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 ml-8">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      task.status === 'COMPLETED' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {task.status.replace('_', ' ')}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      task.priority === 'URGENT' ? 'text-red-600 bg-red-50 dark:bg-red-900/20' :
                      task.priority === 'HIGH' ? 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' :
                      task.priority === 'MEDIUM' ? 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20' :
                      'text-green-600 bg-green-50 dark:bg-green-900/20'
                    }`}>
                      {task.priority}
                    </span>
                    {task.dueDate && (
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        📅 {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="hidden lg:flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => router.push(`/pomodoro?task=${task.id}&subject=${task.title}`)} title="Start Pomodoro">
                    <Timer className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setEditingTask(task)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => deleteTask(task.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {!Array.isArray(tasks) && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Loading tasks...</p>
          </div>
        )}
      </div>
    </div>
  )
}