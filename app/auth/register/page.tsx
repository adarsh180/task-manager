"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RedirectIfAuthenticated } from '@/components/redirect-if-authenticated'
import { GoogleAuthButton } from '@/components/google-auth-button'
import { Eye, EyeOff, Mail, Lock, User, BookOpen, Sparkles, GraduationCap } from 'lucide-react'
import { motion } from 'framer-motion'

const EXAM_TYPES = [
  { value: 'UPSC', label: 'UPSC Civil Services' },
  { value: 'NEET_UG', label: 'NEET UG' },
  { value: 'IIT_JEE', label: 'IIT JEE' },
  { value: 'CSIR_UGC_NET', label: 'CSIR UGC-NET' },
  { value: 'NEET_PG', label: 'NEET PG' },
  { value: 'CODING', label: 'Coding Interviews' },
  { value: 'DSA', label: 'Data Structures & Algorithms' },
  { value: 'AI_ML', label: 'AI/ML' }
]

export default function RegisterPage() {
  return (
    <RedirectIfAuthenticated>
      <RegisterForm />
    </RedirectIfAuthenticated>
  )
}

function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    examType: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsLoading(false)
      return
    }

    try {
      console.log('Attempting registration with:', { 
        name: formData.name, 
        email: formData.email,
        examType: formData.examType 
      })
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          examType: formData.examType || null
        })
      })

      const data = await response.json()
      console.log('Registration response:', { ok: response.ok, data })

      if (response.ok) {
        console.log('Storing auth data:', { token: !!data.token, user: data.user })
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        // Force a page reload to ensure clean state
        console.log('Registration successful, reloading page')
        window.location.replace('/')
      } else {
        setError(data.error || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-8">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-green-900/20 dark:to-blue-900/20" />
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(circle at 30% 40%, #10b981 0%, transparent 50%)',
            'radial-gradient(circle at 70% 60%, #3b82f6 0%, transparent 50%)',
            'radial-gradient(circle at 50% 20%, #8b5cf6 0%, transparent 50%)',
            'radial-gradient(circle at 30% 40%, #10b981 0%, transparent 50%)',
          ]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Floating Elements */}
      <motion.div
        className="absolute top-10 left-10 w-24 h-24 bg-green-200/30 rounded-full blur-xl"
        animate={{ y: [-30, 30, -30], x: [-15, 15, -15] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-36 h-36 bg-blue-200/30 rounded-full blur-xl"
        animate={{ y: [30, -30, 30], x: [15, -15, 15] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md p-4"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20 shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center"
              >
                <GraduationCap className="w-8 h-8 text-white" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Join StudyAI
                </CardTitle>
                <p className="text-muted-foreground mt-2 flex items-center justify-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  Start your learning adventure
                </p>
              </motion.div>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <GoogleAuthButton text="Sign up with Google" isLoading={isLoading} />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="relative"
              >
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or create with email</span>
                </div>
              </motion.div>

              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      type="text"
                      placeholder="Enter your full name"
                      className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Study Focus (Optional)</label>
                  <div className="relative group">
                    <BookOpen className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-200"
                      value={formData.examType}
                      onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                    >
                      <option value="">Select your focus area</option>
                      {EXAM_TYPES.map((exam) => (
                        <option key={exam.value} value={exam.value}>
                          {exam.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        className="pl-10 pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </motion.button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confirm</label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm"
                        className="pl-10 pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </motion.button>
                    </div>
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all duration-200" disabled={isLoading}>
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                      />
                    ) : null}
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="text-center text-sm"
                >
                  <span className="text-muted-foreground">Already have an account? </span>
                  <Link href="/auth/login" className="text-primary hover:underline font-medium transition-colors">
                    Sign in
                  </Link>
                </motion.div>
              </motion.form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}