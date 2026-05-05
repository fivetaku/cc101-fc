/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SectionTier } from '@/types'

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

function send(event: string, params: Record<string, unknown>) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', event, params)
  }
}

export function trackSectionView(params: {
  section_id: string
  section_index: number
  content_type: SectionTier
}) {
  send('clip_view', params)
}

export function trackCtaClick(params: {
  cta_id: string
  destination: string
  from_section?: string
}) {
  send('cta_click', params)
}

export function trackExternalLinkClick(params: {
  link_domain: string
  link_url: string
  from_section: string
}) {
  send('external_link_click', params)
}

export function trackTocClick(params: {
  target_section: string
  is_mobile: boolean
}) {
  send('toc_click', params)
}

export function trackCopyPrompt(params: {
  clip_id: string
  code_lang: string
  code_first_line_hash: string
}) {
  send('copy_prompt', params)
}

export function trackSearchQuery(params: {
  query: string
  result_count: number
}) {
  send('search_query', params)
}
