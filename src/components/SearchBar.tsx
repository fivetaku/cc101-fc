'use client'

import Fuse from 'fuse.js'
import { useEffect, useMemo, useState } from 'react'
import type { JSX } from 'react'
import { trackSearchQuery } from '@/lib/analytics'

interface SearchEntry {
  id: string
  tier: string
  tier_label: string
  title: string
  subtitle: string
  headings: string[]
  url: string
}

interface SearchBarProps {
  onResults: (matchedIds: string[] | null) => void
}

export function SearchBar(props: SearchBarProps): JSX.Element {
  const { onResults } = props
  const [entries, setEntries] = useState<SearchEntry[]>([])
  const [indexLoaded, setIndexLoaded] = useState(false)
  const [query, setQuery] = useState('')
  const [isComposing, setIsComposing] = useState(false)

  const fuse = useMemo(
    () =>
      new Fuse(entries, {
        keys: [
          { name: 'title', weight: 3 },
          { name: 'subtitle', weight: 2 },
          { name: 'headings', weight: 1 },
          { name: 'tier_label', weight: 0.5 },
        ],
        threshold: 0.4,
        minMatchCharLength: 2,
        ignoreLocation: true,
      }),
    [entries]
  )

  useEffect(() => {
    let cancelled = false

    fetch('/search-index.json')
      .then((response) => (response.ok ? response.json() : []))
      .then((data: SearchEntry[]) => {
        if (cancelled) return
        setEntries(data)
        setIndexLoaded(true)
      })
      .catch(() => {
        if (cancelled) return
        setEntries([])
        setIndexLoaded(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (isComposing) return

    const trimmedQuery = query.trim()
    const timer = window.setTimeout(() => {
      if (trimmedQuery.length === 0) {
        onResults(null)
        return
      }
      if (!indexLoaded) return

      const matchedIds = fuse.search(trimmedQuery).map(({ item }) => item.id)
      onResults(matchedIds)
      trackSearchQuery({ query: trimmedQuery, result_count: matchedIds.length })
    }, 200)

    return () => window.clearTimeout(timer)
  }, [fuse, indexLoaded, isComposing, onResults, query])

  return (
    <input
      type="text"
      value={query}
      onChange={(event) => setQuery(event.currentTarget.value)}
      onCompositionStart={() => setIsComposing(true)}
      onCompositionEnd={(event) => {
        setIsComposing(false)
        setQuery(event.currentTarget.value)
      }}
      placeholder="클립 검색..."
      aria-label="클립 검색"
      className="mb-4 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-100 dark:placeholder:text-zinc-500"
    />
  )
}
