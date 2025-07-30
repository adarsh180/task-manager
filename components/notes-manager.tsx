"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Edit, Trash2, FileText } from 'lucide-react'

interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

interface NotesManagerProps {
  onUpdate: () => void
}

export function NotesManager({ onUpdate }: NotesManagerProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  })

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/notes', {
        headers: getAuthHeaders()
      })
      const data = await response.json()
      setNotes(data)
    } catch (error) {
      console.error('Failed to fetch notes:', error)
    }
  }

  const createNote = async () => {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        setFormData({ title: '', content: '' })
        setIsCreating(false)
        fetchNotes()
        onUpdate()
      }
    } catch (error) {
      console.error('Failed to create note:', error)
    }
  }

  const updateNote = async (id: string, updates: Partial<Note>) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      })
      
      if (response.ok) {
        setEditingNote(null)
        fetchNotes()
        onUpdate()
      }
    } catch (error) {
      console.error('Failed to update note:', error)
    }
  }

  const deleteNote = async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders()
      })
      if (response.ok) {
        fetchNotes()
        onUpdate()
      }
    } catch (error) {
      console.error('Failed to delete note:', error)
    }
  }

  const startEdit = (note: Note) => {
    setEditingNote(note)
    setFormData({ title: note.title, content: note.content })
  }

  const saveEdit = () => {
    if (editingNote) {
      updateNote(editingNote.id, formData)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg p-6 border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Notes Manager</h2>
            <p className="text-muted-foreground mt-1">Capture and organize your study notes</p>
          </div>
          <Button onClick={() => setIsCreating(true)} size="lg" className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Create New Note
          </Button>
        </div>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Note</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Note title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <Textarea
              placeholder="Note content"
              rows={6}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
            <div className="flex gap-2">
              <Button onClick={createNote}>Create Note</Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {editingNote && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Note</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Note title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <Textarea
              placeholder="Note content"
              rows={6}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
            <div className="flex gap-2">
              <Button onClick={saveEdit}>Save Changes</Button>
              <Button variant="outline" onClick={() => setEditingNote(null)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.isArray(notes) && notes.map((note) => (
          <Card key={note.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-purple-200 dark:border-l-purple-800 h-fit">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <FileText className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <CardTitle className="text-lg text-foreground line-clamp-2">{note.title}</CardTitle>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => startEdit(note)} className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteNote(note.id)} className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed line-clamp-6">
                  {note.content}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="bg-muted px-2 py-1 rounded">
                    📅 {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                  <span className="bg-muted px-2 py-1 rounded">
                    {note.content.length} chars
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {!Array.isArray(notes) && (
          <div className="text-center py-8 text-muted-foreground col-span-full">
            <p>Loading notes...</p>
          </div>
        )}
        {Array.isArray(notes) && notes.length === 0 && (
          <div className="text-center py-8 text-muted-foreground col-span-full">
            <p>No notes created yet</p>
          </div>
        )}
      </div>

      {notes.length === 0 && !isCreating && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No notes yet. Create your first note!</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}