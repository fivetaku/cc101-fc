'use client'

import { useEffect, useRef, useState } from 'react'
import type { SectionMeta, SectionTier, TierMeta } from '@/types'
import { trackTocClick } from '@/lib/analytics'
import { SearchBar } from './SearchBar'

interface SidebarProps {
  sections: SectionMeta[]
  tiers: Record<SectionTier, TierMeta>
  onLinkClick?: () => void
  isMobile?: boolean
}

export function Sidebar({ sections, tiers, onLinkClick, isMobile = false }: SidebarProps) {
  const [activeId, setActiveId] = useState<string>('')
  const [collapsedTiers, setCollapsedTiers] = useState<Record<string, boolean>>({})
  const [matchedIds, setMatchedIds] = useState<string[] | null>(null)
  const navRef = useRef<HTMLElement>(null)

  // Auto-scroll sidebar to keep active item visible
  useEffect(() => {
    if (!activeId || !navRef.current) return
    const activeEl = navRef.current.querySelector(`a[href="#${activeId}"]`) as HTMLElement | null
    if (!activeEl) return

    const scrollContainer = navRef.current.parentElement
    if (!scrollContainer) return

    const containerRect = scrollContainer.getBoundingClientRect()
    const elRect = activeEl.getBoundingClientRect()

    if (elRect.top < containerRect.top || elRect.bottom > containerRect.bottom) {
      const offset =
        elRect.top - containerRect.top - containerRect.height / 2 + elRect.height / 2
      scrollContainer.scrollBy({ top: offset, behavior: 'smooth' })
    }
  }, [activeId])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0% -70% 0%' }
    )

    sections.forEach((section) => {
      const el = document.getElementById(section.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sections])

  // Group sections by tier, ordered by tier order
  const tierKeys = Object.keys(tiers).sort(
    (a, b) => tiers[a as SectionTier].order - tiers[b as SectionTier].order
  ) as SectionTier[]
  const visibleSections =
    matchedIds === null ? sections : sections.filter((s) => matchedIds.includes(s.id))

  const grouped = tierKeys.map((key) => ({
    key,
    meta: tiers[key],
    sections: visibleSections.filter((s) => s.tier === key),
  }))

  // reference 그룹은 기본 collapsible (cc101 advanced 패턴)
  const isCollapsible = (key: string) => key === 'reference'

  return (
    <nav ref={navRef} className="flex flex-col gap-1">
      <SearchBar onResults={setMatchedIds} />
      {matchedIds?.length === 0 ? (
        <p className="px-2 py-2 text-sm text-zinc-400 dark:text-zinc-500">검색 결과 없음</p>
      ) : (
        grouped.map(({ key, meta, sections: tierSections }) => {
          if (tierSections.length === 0) return null
          const collapsed = collapsedTiers[key] ?? false
          const collapsible = isCollapsible(key)

          return (
            <div key={key} className="mb-2">
              {collapsible ? (
                <button
                  onClick={() => setCollapsedTiers((s) => ({ ...s, [key]: !collapsed }))}
                  className="mb-2 flex w-full items-center justify-between px-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 transition-colors hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
                >
                  <span>{meta.label}</span>
                  <span className="text-zinc-300 dark:text-zinc-600">
                    {collapsed ? '▸' : '▾'}
                  </span>
                </button>
              ) : (
                <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  {meta.label}
                </p>
              )}
              {!collapsed &&
                tierSections.map((section) => (
                  <SidebarItem
                    key={section.id}
                    section={section}
                    isActive={activeId === section.id}
                    onLinkClick={onLinkClick}
                    isMobile={isMobile}
                  />
                ))}
            </div>
          )
        })
      )}
    </nav>
  )
}

function SidebarItem({
  section,
  isActive,
  onLinkClick,
  isMobile = false,
}: {
  section: SectionMeta
  isActive: boolean
  onLinkClick?: () => void
  isMobile?: boolean
}) {
  const handleClick = () => {
    trackTocClick({ target_section: section.id, is_mobile: isMobile })
    onLinkClick?.()
  }

  // 클립이면 'P-CL' 형태 (예: '1-01'), 레퍼런스면 글로벌 order 표기
  const numLabel =
    section.part != null && section.clip != null
      ? `${section.part}-${String(section.clip).padStart(2, '0')}`
      : String(section.order).padStart(2, '0')

  return (
    <a
      href={`#${section.id}`}
      onClick={handleClick}
      className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
        isActive
          ? 'bg-brand-500/10 text-brand-500 dark:text-brand-400'
          : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-200'
      }`}
    >
      <span className="w-10 text-center font-mono text-[10px] text-zinc-300 dark:text-zinc-600">
        {numLabel}
      </span>
      <span className="truncate">{section.title}</span>
      {section.badge && (
        <span className="ml-auto shrink-0 rounded bg-brand-500/20 px-1 py-0.5 text-[10px] text-brand-500 dark:text-brand-400">
          {section.badge}
        </span>
      )}
    </a>
  )
}
