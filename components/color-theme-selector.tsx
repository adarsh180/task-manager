'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
import { useColorTheme } from '@/components/color-theme-provider'
import { Check, Loader2 } from 'lucide-react'

export function ColorThemeSelector() {
  const { colorTheme, setColorTheme } = useColorTheme()
  const [isUpdating, setIsUpdating] = useState(false)

  const themes = [
    { name: 'blue', label: 'Blue', color: 'bg-blue-500' },
    { name: 'red', label: 'Red', color: 'bg-red-500' },
    { name: 'pink', label: 'Pink', color: 'bg-pink-500' },
    { name: 'green', label: 'Green', color: 'bg-green-500' },
    { name: 'purple', label: 'Purple', color: 'bg-purple-500' }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard Color Theme</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-3">
          {themes.map((theme) => (
            <Button
              key={theme.name}
              variant="outline"
              className={`h-16 flex flex-col items-center justify-center space-y-2 ${
                colorTheme === theme.name ? 'ring-2 ring-primary' : ''
              }`}
              onClick={async () => {
                setIsUpdating(true)
                await setColorTheme(theme.name as any)
                setIsUpdating(false)
              }}
            >
              <div className={`w-6 h-6 rounded-full ${theme.color} relative`}>
                {colorTheme === theme.name && (
                  <Check className="h-4 w-4 text-white absolute inset-0 m-auto" />
                )}
              </div>
              <span className="text-xs">{theme.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}