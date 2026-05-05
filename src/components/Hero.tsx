'use client'

import { useState, useEffect, useRef } from 'react'
import { trackCtaClick } from '@/lib/analytics'

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const [mousePos, setMousePos] = useState({ x: 50, y: 30 })
  const [typedPrompt, setTypedPrompt] = useState('')
  const [cursorOn, setCursorOn] = useState(true)
  const [phase, setPhase] = useState<'waiting' | 'typing' | 'done'>('waiting')

  const prompt = '> 실습을 시작해볼까요?'

  // Typewriter loop
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>
    if (phase === 'waiting') {
      t = setTimeout(() => setPhase('typing'), 900)
    } else if (phase === 'typing') {
      let i = 0
      const tick = () => {
        i++
        setTypedPrompt(prompt.slice(0, i))
        if (i < prompt.length) t = setTimeout(tick, 55)
        else setPhase('done')
      }
      t = setTimeout(tick, 0)
    } else {
      t = setTimeout(() => {
        setTypedPrompt('')
        setPhase('waiting')
      }, 3500)
    }
    return () => clearTimeout(t)
  }, [phase, prompt])

  // Cursor blink
  useEffect(() => {
    const id = setInterval(() => setCursorOn((v) => !v), 520)
    return () => clearInterval(id)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative z-[2] overflow-hidden border-b border-zinc-200 bg-white pb-16 pt-32 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <style>{`
        @keyframes aurora-move {
          from { background-position: 50% 50%, 50% 50%; }
          to   { background-position: 350% 50%, 350% 50%; }
        }
      `}</style>

      {/* Aurora background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: [
              'repeating-linear-gradient(100deg, #09090b 0%, #09090b 7%, transparent 10%, transparent 12%, #09090b 16%)',
              'repeating-linear-gradient(100deg, #ff003c 10%, #ff3a66 15%, #ff003c 20%, #cc0030 25%, #ff003c 30%)',
            ].join(', '),
            backgroundSize: '300%, 200%',
            animation: 'aurora-move 60s linear infinite',
            filter: 'blur(10px) opacity(0.22) saturate(180%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 0%, black 40%, transparent 80%)',
            maskImage: 'radial-gradient(ellipse at 50% 0%, black 40%, transparent 80%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: [
              'repeating-linear-gradient(100deg, #09090b 0%, #09090b 7%, transparent 10%, transparent 12%, #09090b 16%)',
              'repeating-linear-gradient(100deg, #ff003c 10%, #ff3a66 15%, #ff003c 20%, #cc0030 25%, #ff003c 30%)',
            ].join(', '),
            backgroundSize: '200%, 100%',
            animation: 'aurora-move 60s linear infinite',
            filter: 'blur(8px) opacity(0.10) saturate(180%)',
            mixBlendMode: 'screen',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 0%, black 40%, transparent 80%)',
            maskImage: 'radial-gradient(ellipse at 50% 0%, black 40%, transparent 80%)',
          }}
        />
      </div>

      {/* Mouse glow */}
      <div
        className="pointer-events-none absolute z-0 hidden h-[400px] w-[400px] rounded-full bg-brand-500 blur-[100px] opacity-20 md:block"
        style={{
          left: `${mousePos.x}%`,
          top: `${mousePos.y}%`,
          transform: 'translate(-50%, -50%)',
          transition:
            'left 1s cubic-bezier(0.25,0.46,0.45,0.94), top 1s cubic-bezier(0.25,0.46,0.45,0.94)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center lg:px-6">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-500 dark:text-brand-400">
          <span className="font-mono">▸</span>
          <span>Claude Code 뽀개기 가이드</span>
        </div>

        {/* Title */}
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl dark:text-white">
          <span className="text-brand-500 dark:text-brand-400">Claude Code</span>로
          <br />
          AI 시작하기
        </h1>

        {/* Subtitle */}
        <p className="mb-10 text-lg text-zinc-500 sm:text-xl dark:text-zinc-400">
          Fastcampus 클로드코드 뽀개기
        </p>

        {/* Terminal */}
        <div className="mx-auto mb-10 max-w-lg rounded-xl border border-zinc-200 bg-zinc-50 text-left shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-2xl">
          <div className="flex items-center gap-1.5 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div className="h-3 w-3 rounded-full bg-red-500/60" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
            <div className="h-3 w-3 rounded-full bg-green-500/60" />
            <span className="ml-2 font-mono text-xs text-zinc-400 dark:text-zinc-600">Terminal</span>
          </div>
          <div className="p-4 font-mono text-sm">
            <div className="text-zinc-400 dark:text-zinc-500">
              $ curl -fsSL https://claude.ai/install.sh | sh
            </div>
            <div className="mt-1 text-green-600 dark:text-green-400">
              ✓ CC101 with FC ready
            </div>
            <div className="mt-2 text-zinc-400 dark:text-zinc-500">$ claude</div>
            <div className="mt-1 min-h-[1.5rem] text-brand-500 dark:text-brand-400">
              {typedPrompt}
              <span
                className="ml-px inline-block h-[0.9em] w-[8px] translate-y-[1px] rounded-[1px] bg-brand-500 align-middle dark:bg-brand-400"
                style={{ opacity: cursorOn ? 0.85 : 0 }}
              />
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href="#part-1-01-orientation"
            onClick={() =>
              trackCtaClick({
                cta_id: 'start_guide',
                destination: '#part-1-01-orientation',
              })
            }
            className="min-w-[10rem] rounded-lg bg-brand-500 px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-400"
          >
            가이드 시작 →
          </a>
          <a
            href="https://docs.anthropic.com/ko/docs/claude-code"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackCtaClick({
                cta_id: 'official_docs',
                destination: 'https://docs.anthropic.com/ko/docs/claude-code',
              })
            }
            className="min-w-[10rem] rounded-lg border border-zinc-300 px-6 py-3 text-center text-sm font-semibold text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-white"
          >
            공식 문서
          </a>
        </div>

        {/* Stats */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-zinc-400 dark:text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="text-brand-500 dark:text-brand-400">17</span>
            <span>클립</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-brand-500 dark:text-brand-400">패캠</span>
            <span>강의 기반</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-brand-500 dark:text-brand-400">KO</span>
          </div>
        </div>
      </div>
    </section>
  )
}
