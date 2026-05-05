'use client'

import { useEffect, useRef } from 'react'
import type { SectionTier, SectionType, SectionFrontmatter } from '@/types'
import { trackExternalLinkClick, trackSectionView } from '@/lib/analytics'

interface SectionBlockProps {
  id: string
  order: number
  tier: SectionTier
  type: SectionType
  title: string
  subtitle: string
  part: number | null
  clip: number | null
  badge?: string | null
  frontmatter?: SectionFrontmatter
  children: React.ReactNode
}

export function SectionBlock({
  id,
  order,
  tier,
  type,
  title,
  subtitle,
  part,
  clip,
  badge,
  children,
}: SectionBlockProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const viewFired = useRef(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !viewFired.current) {
          viewFired.current = true
          trackSectionView({
            section_id: id,
            section_index: order,
            content_type: tier,
          })
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [id, order, tier])

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = (e.target as HTMLElement).closest('a')
    if (!target) return
    const href = target.getAttribute('href') ?? ''
    if (href.startsWith('http')) {
      try {
        const domain = new URL(href).hostname
        trackExternalLinkClick({ link_domain: domain, link_url: href, from_section: id })
      } catch {}
    }
  }

  const isReference = type === 'reference'
  const partLabel =
    part != null && clip != null ? `Part ${part} · Clip ${clip}` : null

  return (
    <section
      id={id}
      ref={sectionRef}
      className="scroll-mt-20 border-b border-zinc-200 py-12 last:border-0 dark:border-zinc-800/60"
    >
      {/* Section header — 단일 헤더 */}
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">{title}</h2>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 sm:text-base">{subtitle}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400 dark:text-zinc-500">
          {partLabel && <span className="font-mono">{partLabel}</span>}
          {badge && (
            <span className="rounded bg-brand-500/15 px-2 py-0.5 text-[11px] font-medium text-brand-500 dark:text-brand-400">
              {badge}
            </span>
          )}
          {isReference && (
            <span className="rounded bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              레퍼런스
            </span>
          )}
        </div>
      </header>

      <div
        onClick={handleContentClick}
        className="prose prose-zinc max-w-none dark:prose-invert
          prose-headings:font-bold
          prose-h2:text-xl prose-h3:text-lg prose-h4:text-base
          prose-p:leading-relaxed
          prose-a:text-brand-500 prose-a:no-underline hover:prose-a:underline dark:prose-a:text-brand-400
          prose-code:rounded prose-code:bg-zinc-100 prose-code:px-1.5 prose-code:py-0.5
          prose-code:text-brand-600 prose-code:text-sm
          prose-code:before:content-none prose-code:after:content-none
          dark:prose-code:bg-zinc-800 dark:prose-code:text-brand-300
          prose-pre:rounded-xl prose-pre:border prose-pre:border-zinc-200 prose-pre:bg-zinc-50
          dark:prose-pre:border-zinc-700 dark:prose-pre:bg-zinc-900
          prose-blockquote:border-brand-500/50
          prose-table:text-sm
          prose-hr:border-zinc-200 dark:prose-hr:border-zinc-800"
      >
        {children}
      </div>
    </section>
  )
}
