'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type ColorTheme = 'blue' | 'red' | 'pink' | 'green' | 'purple'

type ColorThemeProviderProps = {
  children: React.ReactNode
}

type ColorThemeProviderState = {
  colorTheme: ColorTheme
  setColorTheme: (theme: ColorTheme) => void
}

const initialState: ColorThemeProviderState = {
  colorTheme: 'blue',
  setColorTheme: () => null,
}

const ColorThemeProviderContext = createContext<ColorThemeProviderState>(initialState)

const colorThemes = {
  blue: {
    primary: 'hsl(221.2 83.2% 53.3%)',
    primaryForeground: 'hsl(210 40% 98%)',
    primaryRgb: '59 130 246'
  },
  red: {
    primary: 'hsl(0 84.2% 60.2%)',
    primaryForeground: 'hsl(210 40% 98%)',
    primaryRgb: '239 68 68'
  },
  pink: {
    primary: 'hsl(330 81% 60%)',
    primaryForeground: 'hsl(210 40% 98%)',
    primaryRgb: '236 72 153'
  },
  green: {
    primary: 'hsl(142.1 76.2% 36.3%)',
    primaryForeground: 'hsl(355.7 100% 97.3%)',
    primaryRgb: '34 197 94'
  },
  purple: {
    primary: 'hsl(262.1 83.3% 57.8%)',
    primaryForeground: 'hsl(210 40% 98%)',
    primaryRgb: '147 51 234'
  }
}

export function ColorThemeProvider({ children }: ColorThemeProviderProps) {
  const [colorTheme, setColorTheme] = useState<ColorTheme>('blue')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        const user = JSON.parse(userData)
        if (user.colorTheme && user.colorTheme !== colorTheme) {
          setColorTheme(user.colorTheme)
        }
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      const root = document.documentElement
      const theme = colorThemes[colorTheme]
      
      root.style.setProperty('--primary', theme.primary)
      root.style.setProperty('--primary-foreground', theme.primaryForeground)
      root.style.setProperty('--primary-rgb', theme.primaryRgb)
    }
  }, [colorTheme, mounted])

  // Listen for storage changes to sync theme across tabs
  useEffect(() => {
    const handleStorageChange = () => {
      const userData = localStorage.getItem('user')
      if (userData) {
        try {
          const user = JSON.parse(userData)
          if (user.colorTheme && user.colorTheme !== colorTheme) {
            setColorTheme(user.colorTheme)
          }
        } catch (error) {
          console.error('Error parsing user data:', error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [colorTheme])

  const updateColorTheme = async (theme: ColorTheme) => {
    setColorTheme(theme)
    
    // Update localStorage immediately
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        const user = JSON.parse(userData)
        user.colorTheme = theme
        localStorage.setItem('user', JSON.stringify(user))
        
        // Update database
        const token = localStorage.getItem('token')
        const response = await fetch('/api/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            name: user.name,
            phone: user.phone || '',
            bio: user.bio || '',
            location: user.location || '',
            examType: user.examType || '',
            colorTheme: theme 
          })
        })
        
        if (response.ok) {
          const updatedUser = await response.json()
          localStorage.setItem('user', JSON.stringify(updatedUser))
        }
      } catch (error) {
        console.error('Failed to update color theme:', error)
      }
    }
  }

  if (!mounted) {
    return <>{children}</>
  }

  const value = {
    colorTheme,
    setColorTheme: updateColorTheme,
  }

  return (
    <ColorThemeProviderContext.Provider value={value}>
      {children}
    </ColorThemeProviderContext.Provider>
  )
}

export const useColorTheme = () => {
  const context = useContext(ColorThemeProviderContext)

  if (context === undefined)
    throw new Error('useColorTheme must be used within a ColorThemeProvider')

  return context
}