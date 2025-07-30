"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, getSession } from 'next-auth/react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RedirectIfAuthenticated } from '@/components/redirect-if-authenticated'
import { GoogleAuthButton } from '@/components/google-auth-button'
import { Eye, EyeOff, Mail, Lock, Sparkles, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LoginPage() {
  return (
    <RedirectIfAuthenticated>
      <LoginForm />
    </RedirectIfAuthenticated>
  )
}

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      console.log('Attempting login with:', { email: formData.email })
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      console.log('Login response:', { ok: response.ok, data })

      if (response.ok) {
        console.log('Storing auth data:', { token: !!data.token, user: data.user })
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        // Force a page reload to ensure clean state
        console.log('Login successful, reloading page')
        window.location.replace('/')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20" />
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%)',
            'radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%)',
            'radial-gradient(circle at 40% 80%, #06b6d4 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%)',
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-20 w-20 h-20 bg-blue-200/30 rounded-full blur-xl"
        animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-32 h-32 bg-purple-200/30 rounded-full blur-xl"
        animate={{ y: [20, -20, 20], x: [10, -10, 10] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
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
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center"
              >
                <BookOpen className="w-8 h-8 text-white" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Welcome Back
                </CardTitle>
                <p className="text-muted-foreground mt-2 flex items-center justify-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  Continue your learning journey
                </p>
              </motion.div>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <GoogleAuthButton text="Continue with Google" isLoading={isLoading} />
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
                  <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
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
                  <label className="text-sm font-medium">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
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

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200" disabled={isLoading}>
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                      />
                    ) : null}
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="text-center text-sm"
                >
                  <span className="text-muted-foreground">Don't have an account? </span>
                  <Link href="/auth/register" className="text-primary hover:underline font-medium transition-colors">
                    Sign up
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