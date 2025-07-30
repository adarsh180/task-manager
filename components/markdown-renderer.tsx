"use client"

import React from 'react'
import { CodeBlock } from '@/components/code-block'

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const renderContent = (text: string) => {
    const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const beforeText = text.slice(lastIndex, match.index)
        if (beforeText.trim()) {
          parts.push(
            <div key={`text-${lastIndex}`} className="whitespace-pre-wrap">
              {formatContent(beforeText)}
            </div>
          )
        }
      }

      const language = match[1] || 'text'
      const code = match[2].trim()
      parts.push(
        <CodeBlock
          key={`code-${match.index}`}
          code={code}
          language={language}
        />
      )

      lastIndex = match.index + match[0].length
    }

    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex)
      if (remainingText.trim()) {
        parts.push(
          <div key={`text-${lastIndex}`} className="whitespace-pre-wrap">
            {formatContent(remainingText)}
          </div>
        )
      }
    }

    if (parts.length === 0) {
      return (
        <div className="whitespace-pre-wrap">
          {formatContent(text)}
        </div>
      )
    }

    return parts
  }

  const formatContent = (text: string) => {
    const lines = text.split('\n')
    const elements: React.ReactNode[] = []
    let currentList: string[] = []
    let listType: 'ul' | 'ol' | null = null

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <div key={elements.length} className="ml-2 mb-4 bg-muted/30 rounded-lg p-3 border-l-4 border-primary">
            {currentList.map((item, idx) => (
              <div key={idx} className="flex items-start mb-2 last:mb-0">
                <span className="text-primary mr-3 mt-0.5 font-semibold min-w-[20px]">
                  {listType === 'ol' ? `${idx + 1}.` : '▸'}
                </span>
                <span className="flex-1 leading-relaxed">{formatInlineText(item)}</span>
              </div>
            ))}
          </div>
        )
        currentList = []
        listType = null
      }
    }

    lines.forEach((line, index) => {
      const trimmed = line.trim()

      if (trimmed.startsWith('# ')) {
        flushList()
        elements.push(
          <div key={index} className="mb-4">
            <h1 className="text-xl font-bold text-primary border-b-2 border-primary/20 pb-2 mb-3">
              {trimmed.slice(2)}
            </h1>
          </div>
        )
      } else if (trimmed.startsWith('## ')) {
        flushList()
        elements.push(
          <div key={index} className="mb-3">
            <h2 className="text-lg font-semibold text-primary/90 mb-2 flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              {trimmed.slice(3)}
            </h2>
          </div>
        )
      } else if (trimmed.startsWith('### ')) {
        flushList()
        elements.push(
          <h3 key={index} className="text-base font-medium mb-2 text-muted-foreground">
            {trimmed.slice(4)}
          </h3>
        )
      } else if (trimmed.match(/^[-*•]\s/)) {
        if (listType !== 'ul') {
          flushList()
          listType = 'ul'
        }
        currentList.push(trimmed.slice(2))
      } else if (trimmed.match(/^\d+\.\s/)) {
        if (listType !== 'ol') {
          flushList()
          listType = 'ol'
        }
        currentList.push(trimmed.replace(/^\d+\.\s/, ''))
      } else if (trimmed) {
        flushList()
        elements.push(
          <p key={index} className="mb-3 leading-relaxed text-foreground/90">
            {formatInlineText(trimmed)}
          </p>
        )
      } else {
        flushList()
        elements.push(<div key={index} className="mb-2" />)
      }
    })

    flushList()
    return elements
  }

  const formatInlineText = (text: string) => {
    text = text.replace(/\|/g, ' ')
    text = text.replace(/[-]{3,}/g, '')
    
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-primary">$1</strong>')
    text = text.replace(/\*(.*?)\*/g, '<em class="italic text-muted-foreground">$1</em>')
    text = text.replace(/`(.*?)`/g, '<code class="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-mono border">$1</code>')
    
    return <span dangerouslySetInnerHTML={{ __html: text }} />
  }

  return (
    <div className="prose prose-sm max-w-none">
      {renderContent(content)}
    </div>
  )
}