'use client'

import type * as React from 'react'
import type { JSX } from 'react'
import { useRef } from 'react'
import { Clipboard } from 'lucide-react'
import { trackCopyPrompt } from '@/lib/analytics'
import { useToast } from './Toast'

interface CodeBlockProps {
  children: React.ReactNode
  className?: string
}

function copyWithTextarea(text: string) {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.top = '0'
  textarea.style.left = '0'
  textarea.style.width = '1px'
  textarea.style.height = '1px'
  textarea.style.padding = '0'
  textarea.style.border = '0'
  textarea.style.opacity = '0'
  textarea.style.fontSize = '16px'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  textarea.setSelectionRange(0, textarea.value.length)

  try {
    if (!document.execCommand('copy')) {
      throw new Error('copy command failed')
    }
  } finally {
    textarea.remove()
  }
}

function getCodeLang(pre: HTMLPreElement, className = '') {
  return (
    `${className} ${pre.querySelector('code')?.className ?? ''}`.match(
      /(?:^|\s)language-([^\s]+)/
    )?.[1] ?? 'plain'
  )
}

function getFirstLineHash(text: string) {
  const firstLine = text.split('\n')[0]?.replace(/\r$/, '') ?? ''
  return `${firstLine.length}-${firstLine.slice(0, 6)}`
}

export function CodeBlock(props: CodeBlockProps): JSX.Element {
  const { children, className } = props
  const toast = useToast()
  const preRef = useRef<HTMLPreElement>(null)

  const handleCopy = async () => {
    const pre = preRef.current
    if (!pre) return
    const text = pre.textContent ?? ''

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        copyWithTextarea(text)
      }
    } catch {
      try {
        copyWithTextarea(text)
      } catch {
        return
      }
    }

    trackCopyPrompt({
      clip_id: pre.closest('[id^="part-"], [id^="ref-"]')?.id ?? 'unknown',
      code_lang: getCodeLang(pre, className),
      code_first_line_hash: getFirstLineHash(text),
    })
    toast.show('복사됨!')
  }

  return (
    <div className="group relative">
      <pre ref={preRef} className={className}>
        {children}
      </pre>
      <button
        type="button"
        aria-label="코드 복사"
        onClick={handleCopy}
        className="absolute top-2 right-2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 bg-white/90 text-zinc-500 shadow-sm backdrop-blur transition-colors hover:border-brand-500 hover:text-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-300 dark:hover:border-brand-500 dark:hover:text-brand-400"
      >
        <Clipboard className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  )
}
