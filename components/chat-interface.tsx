"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  MessageCircle, 
  Send, 
  Plus, 
  Trash2, 
  Bot, 
  User, 
  Loader2,
  History,
  BookOpen
} from 'lucide-react'
import { MarkdownRenderer } from '@/components/markdown-renderer'

interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  createdAt: string
}

interface ChatSession {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  messages?: ChatMessage[]
}

interface ChatInterfaceProps {
  onUpdate: () => void
}

export function ChatInterface({ onUpdate }: ChatInterfaceProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/chat/sessions', {
        headers: getAuthHeaders()
      })
      if (response.ok) {
        const data = await response.json()
        setSessions(data)
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error)
    }
  }

  const createNewSession = async () => {
    try {
      const response = await fetch('/api/chat/sessions', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title: 'New Chat' })
      })
      
      if (response.ok) {
        const newSession = await response.json()
        setSessions(prev => [newSession, ...prev])
        setCurrentSession(newSession)
        setMessages([])
        fetchSessions()
      }
    } catch (error) {
      console.error('Failed to create session:', error)
    }
  }

  const deleteSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/chat/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })
      
      // Always update UI optimistically, even if server returns error
      setSessions(prev => prev.filter(s => s.id !== sessionId))
      if (currentSession?.id === sessionId) {
        setCurrentSession(null)
        setMessages([])
      }
      
      if (response.ok) {
        console.log('Session deleted successfully')
      } else {
        console.log('Session may have been already deleted')
      }
      
      // Refresh sessions list
      fetchSessions()
    } catch (error) {
      console.error('Failed to delete session:', error)
      // Still update UI to remove the session
      setSessions(prev => prev.filter(s => s.id !== sessionId))
      if (currentSession?.id === sessionId) {
        setCurrentSession(null)
        setMessages([])
      }
    }
  }

  const loadSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/chat/sessions/${sessionId}`, {
        headers: getAuthHeaders()
      })
      
      if (response.ok) {
        const session = await response.json()
        setCurrentSession(session)
        setMessages(session.messages || [])
      }
    } catch (error) {
      console.error('Failed to load session:', error)
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentSession || isLoading) return

    const userMessage = inputMessage.trim()
    setInputMessage('')
    setIsLoading(true)
    setIsTyping(true)

    // Add user message to UI immediately
    const tempUserMessage: ChatMessage = {
      id: 'temp-user',
      content: userMessage,
      role: 'user',
      createdAt: new Date().toISOString()
    }
    setMessages(prev => [...prev, tempUserMessage])

    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          sessionId: currentSession.id,
          content: userMessage
        })
      })

      if (response.ok) {
        const data = await response.json()
        setIsTyping(false)
        setMessages(prev => [
          ...prev.filter(m => m.id !== 'temp-user'),
          data.userMessage,
          data.assistantMessage
        ])
        fetchSessions() // Update session list
        onUpdate()
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      setMessages(prev => prev.filter(m => m.id !== 'temp-user'))
      setIsTyping(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const examType = user.examType

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg p-6 border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">AI Study Assistant</h2>
            <p className="text-muted-foreground mt-1">Get personalized help for your {examType || 'studies'}</p>
          </div>
          <Button onClick={() => setIsSidebarOpen(!isSidebarOpen)} variant="outline" className="w-full sm:w-auto">
            <History className="h-4 w-4 mr-2" />
            {isSidebarOpen ? 'Hide' : 'Show'} History
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[700px]">
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'lg:w-80 w-full' : 'w-0 lg:w-0'} transition-all duration-300 ${isSidebarOpen ? 'block' : 'hidden lg:block'} lg:border-r bg-muted/30 rounded-lg overflow-hidden`}>
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Chat Sessions
              </h3>
              <Button size="sm" onClick={createNewSession}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {examType && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-primary/10 px-3 py-2 rounded-lg">
                <BookOpen className="h-4 w-4" />
                {examType.replace('_', ' ')} Assistant
              </div>
            )}
          </div>
        
        <div className="p-2 space-y-2 overflow-y-auto max-h-[500px]">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`p-3 rounded-lg cursor-pointer hover:bg-muted transition-colors ${
                currentSession?.id === session.id ? 'bg-muted' : ''
              }`}
              onClick={() => loadSession(session.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{session.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(session.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteSession(session.id)
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
          
          {sessions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <History className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">No chat history yet</p>
            </div>
          )}
        </div>
      </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-background rounded-lg border">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Bot className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold text-lg">
                      {currentSession ? currentSession.title : 'New Chat Session'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {examType ? `${examType.replace('_', ' ')} Assistant` : 'Study Assistant'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {messages.length} messages
                </span>
                {!currentSession && (
                  <Button onClick={createNewSession} size="sm">
                    Start Chat
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {!currentSession ? (
              <div className="text-center text-muted-foreground py-12">
                <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Bot className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Welcome to your AI Study Assistant!</h3>
                <p className="text-base mb-4">
                  I'm here to help with your {examType ? examType.replace('_', ' ') : 'studies'}. Ask me anything!
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto mb-6">
                  <div className="bg-muted/50 p-3 rounded-lg text-sm">
                    📚 Explain concepts
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg text-sm">
                    ❓ Answer questions
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg text-sm">
                    📝 Create practice problems
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg text-sm">
                    🎯 Study strategies
                  </div>
                </div>
                <Button onClick={createNewSession} size="lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Start New Chat
                </Button>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="h-8 w-8 mx-auto mb-2" />
                <p>Start a conversation with your AI study assistant</p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start space-x-3 max-w-[85%] ${
                    message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`p-2 rounded-full flex-shrink-0 ${
                      message.role === 'user' ? 'bg-primary' : 'bg-background border'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="h-5 w-5 text-primary-foreground" />
                      ) : (
                        <Bot className="h-5 w-5 text-foreground" />
                      )}
                    </div>
                    <div className={`rounded-lg p-4 shadow-sm ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-background border text-foreground'
                    }`}>
                      {message.role === 'user' ? (
                        <p className="text-sm whitespace-pre-wrap leading-relaxed text-primary-foreground">{message.content}</p>
                      ) : (
                        <div className="text-sm text-foreground">
                          <MarkdownRenderer content={message.content} />
                        </div>
                      )}
                      <p className="text-xs opacity-70 mt-3 text-right">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-background border flex items-center justify-center">
                <Bot className="h-4 w-4 text-foreground" />
              </div>
              <div className="bg-background border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                  <span className="text-sm text-foreground">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

          {/* Input Area */}
          {currentSession && (
            <div className="p-4 border-t bg-muted/20">
              <div className="flex space-x-3">
                <Textarea
                  placeholder="Ask me anything about your studies..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="min-h-[60px] resize-none bg-background"
                  disabled={isLoading}
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={!inputMessage.trim() || isLoading}
                  size="lg"
                  className="px-6"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Press Enter to send • AI responses may take a moment
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}