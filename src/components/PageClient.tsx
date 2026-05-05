'use client'

import { useEffect, useState } from 'react'
import { Nav } from './Nav'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'
import { Hero } from './Hero'
import { ToastProvider } from './Toast'
import type { SectionMeta, SectionTier, TierMeta } from '@/types'

interface PageClientProps {
  sections: SectionMeta[]
  tiers: Record<SectionTier, TierMeta>
  children: React.ReactNode
}

export function PageClient({ sections, tiers, children }: PageClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
    } else {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }
    return () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  // Watermark — CC101 with FC
  const watermarkUrl = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='320'%3E%3Ctext transform='rotate(-45 160 160)' x='160' y='160' text-anchor='middle' dominant-baseline='middle' fill='rgba(120%2C120%2C120%2C0.22)' font-size='15' font-family='system-ui%2Csans-serif' letter-spacing='2'%3ECC101 with FC%3C/text%3E%3C/svg%3E")`

  return (
    <ToastProvider>
      {/* Watermark overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1] select-none"
        style={{ backgroundImage: watermarkUrl, backgroundRepeat: 'repeat' }}
      />
      <Nav
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuToggle={() => setMobileMenuOpen((v) => !v)}
      />

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute right-0 top-14 h-[calc(100vh-3.5rem)] w-72 overflow-y-auto overscroll-contain border-l border-zinc-200 bg-white p-4 shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
            <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              목차
            </p>
            <Sidebar
              sections={sections}
              tiers={tiers}
              onLinkClick={() => setMobileMenuOpen(false)}
              isMobile={true}
            />
          </div>
        </div>
      )}

      <Hero />

      <div className="mx-auto flex max-w-screen-xl">
        {/* Sidebar */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-zinc-200 p-4 lg:block dark:border-zinc-800">
          <Sidebar sections={sections} tiers={tiers} />
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 px-4 py-4 lg:px-10 lg:py-8">{children}</main>
      </div>

      <Footer />
    </ToastProvider>
  )
}
