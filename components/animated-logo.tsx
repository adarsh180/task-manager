'use client'

import { useEffect, useState } from 'react'

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
}

export function AnimatedLogo({ size = 'md', showText = true }: AnimatedLogoProps) {
  const [isAnimating, setIsAnimating] = useState(true)

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl', 
    xl: 'text-4xl'
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(prev => !prev)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center space-x-3">
      <div className={`${sizeClasses[size]} relative`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          style={{
            filter: 'drop-shadow(0 3px 15px rgba(220, 38, 38, 0.4))'
          }}
        >
          {/* Outer tracking ring */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#trackingGradient)"
            strokeWidth="2"
            strokeDasharray="8 4"
            className={`${isAnimating ? 'animate-spin' : ''} transition-all duration-1000`}
            style={{ transformOrigin: '50px 50px', animationDuration: '10s' }}
          />
          
          {/* Connected nodes pattern */}
          <g className="opacity-80">
            <circle cx="30" cy="30" r="3" fill="#DC2626">
              <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="70" cy="30" r="3" fill="#B91C1C">
              <animate attributeName="r" values="3;5;3" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="30" cy="70" r="3" fill="#991B1B">
              <animate attributeName="r" values="3;5;3" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="70" cy="70" r="3" fill="#7F1D1D">
              <animate attributeName="r" values="3;5;3" dur="2.2s" repeatCount="indefinite" />
            </circle>
            
            {/* Connecting lines */}
            <path d="M30,30 L70,30 L70,70 L30,70 Z" fill="none" stroke="#DC2626" strokeWidth="1" opacity="0.3" />
            <path d="M30,30 L70,70" fill="none" stroke="#B91C1C" strokeWidth="1" opacity="0.3" />
            <path d="M70,30 L30,70" fill="none" stroke="#991B1B" strokeWidth="1" opacity="0.3" />
          </g>
          
          {/* Central tracking hub */}
          <circle
            cx="50"
            cy="50"
            r="20"
            fill="url(#centralGradient)"
            className={`${isAnimating ? 'animate-pulse' : ''} transition-all duration-1000`}
          />
          
          {/* Progress indicator */}
          <g className={`${isAnimating ? 'animate-spin' : ''} transition-all duration-1000`} style={{ transformOrigin: '50px 50px', animationDuration: '8s' }}>
            <path
              d="M50,35 A15,15 0 0,1 65,50"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M50,35 A15,15 0 1,0 35,50"
              fill="none"
              stroke="white"
              strokeWidth="2"
              opacity="0.6"
              strokeLinecap="round"
            />
          </g>
          
          {/* Central tracking dot */}
          <circle
            cx="50"
            cy="50"
            r="4"
            fill="white"
            className={`${isAnimating ? 'animate-ping' : ''} transition-all duration-1000`}
          />
          
          {/* Data flow lines */}
          <g className="opacity-60">
            <path d="M20,50 Q35,40 50,50" fill="none" stroke="#DC2626" strokeWidth="2">
              <animate attributeName="stroke-dasharray" values="0,100;20,80;0,100" dur="3s" repeatCount="indefinite" />
            </path>
            <path d="M80,50 Q65,60 50,50" fill="none" stroke="#B91C1C" strokeWidth="2">
              <animate attributeName="stroke-dasharray" values="0,100;20,80;0,100" dur="3.5s" repeatCount="indefinite" />
            </path>
          </g>
          
          {/* Modern red gradient definitions */}
          <defs>
            <linearGradient id="trackingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DC2626" />
              <stop offset="50%" stopColor="#B91C1C" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>
            <radialGradient id="centralGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="70%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#B91C1C" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent ${textSizes[size]} tracking-tight`}>
            TrackManager
          </span>
          {size === 'xl' && (
            <span className="text-sm text-muted-foreground -mt-1">
              Progress Tracking System
            </span>
          )}
        </div>
      )}
    </div>
  )
}