'use client'

import { TaskManager } from '@/components/task-manager'
import { Navbar } from '@/components/navbar'

export default function TasksPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TaskManager onUpdate={() => {}} />
      </main>
    </div>
  )
}