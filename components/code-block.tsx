"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Copy } from 'lucide-react'

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
}

export function CodeBlock({ code, language = 'text', filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  const getLanguageInfo = (lang: string) => {
    const info: { [key: string]: { label: string; color: string; icon: string } } = {
      'javascript': { label: 'JavaScript', color: 'bg-yellow-500', icon: 'JS' },
      'typescript': { label: 'TypeScript', color: 'bg-blue-500', icon: 'TS' },
      'python': { label: 'Python', color: 'bg-green-500', icon: 'PY' },
      'java': { label: 'Java', color: 'bg-orange-500', icon: 'JAVA' },
      'cpp': { label: 'C++', color: 'bg-blue-600', icon: 'C++' },
      'c': { label: 'C', color: 'bg-gray-600', icon: 'C' },
      'csharp': { label: 'C#', color: 'bg-purple-500', icon: 'C#' },
      'go': { label: 'Go', color: 'bg-cyan-500', icon: 'GO' },
      'rust': { label: 'Rust', color: 'bg-orange-600', icon: 'RS' },
      'php': { label: 'PHP', color: 'bg-indigo-500', icon: 'PHP' },
      'ruby': { label: 'Ruby', color: 'bg-red-500', icon: 'RB' },
      'swift': { label: 'Swift', color: 'bg-orange-400', icon: 'SW' },
      'kotlin': { label: 'Kotlin', color: 'bg-purple-600', icon: 'KT' },
      'sql': { label: 'SQL', color: 'bg-blue-700', icon: 'SQL' },
      'html': { label: 'HTML', color: 'bg-orange-500', icon: 'HTML' },
      'css': { label: 'CSS', color: 'bg-blue-500', icon: 'CSS' },
      'json': { label: 'JSON', color: 'bg-yellow-600', icon: 'JSON' },
      'xml': { label: 'XML', color: 'bg-green-600', icon: 'XML' },
      'yaml': { label: 'YAML', color: 'bg-red-600', icon: 'YAML' },
      'bash': { label: 'Bash', color: 'bg-gray-700', icon: 'SH' },
      'shell': { label: 'Shell', color: 'bg-gray-700', icon: 'SH' },
      'powershell': { label: 'PowerShell', color: 'bg-blue-800', icon: 'PS' }
    }
    return info[lang.toLowerCase()] || { label: lang.toUpperCase(), color: 'bg-gray-500', icon: 'CODE' }
  }

  const langInfo = getLanguageInfo(language)
  const lines = code.split('\n')

  return (
    <div className="relative group my-6 rounded-lg overflow-hidden border border-gray-700 shadow-lg">
      {/* Header */}
      <div className="bg-gray-900 px-4 py-3 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center space-x-3">
          {/* Traffic lights */}
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          
          {/* Language badge */}
          <div className="flex items-center space-x-2">
            <div className={`${langInfo.color} text-white text-xs font-bold px-2 py-1 rounded`}>
              {langInfo.icon}
            </div>
            <span className="text-gray-300 text-sm font-medium">
              {filename || langInfo.label}
            </span>
          </div>
        </div>
        
        {/* Copy button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-gray-300 hover:text-white hover:bg-gray-700 text-xs"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 mr-1" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 mr-1" />
              Copy code
            </>
          )}
        </Button>
      </div>
      
      {/* Code content */}
      <div className="bg-gray-950 overflow-x-auto">
        <div className="flex">
          {/* Line numbers */}
          <div className="bg-gray-900/50 px-3 py-4 text-gray-500 text-sm font-mono select-none border-r border-gray-700">
            {lines.map((_, index) => (
              <div key={index} className="leading-6 text-right">
                {index + 1}
              </div>
            ))}
          </div>
          
          {/* Code */}
          <div className="flex-1">
            <pre className="p-4 text-sm font-mono leading-6">
              <code className={`language-${language} text-gray-100`}>
                {code}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}