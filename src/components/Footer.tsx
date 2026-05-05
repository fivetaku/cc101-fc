'use client'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-zinc-200 bg-white py-12 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-6">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Logo */}
          <div className="font-mono text-xl font-bold text-zinc-900 dark:text-white">
            <span className="text-brand-500 dark:text-brand-400">▸</span> CC101 with FC
          </div>

          {/* Description */}
          <p className="max-w-md text-sm text-zinc-500">
            패스트캠퍼스 &quot;클로드코드 뽀개기&quot; 강의 수강생을 위한 한국어 학습 가이드입니다.
            영상 보면서 옆에 켜두고 따라하세요.
          </p>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-400 dark:text-zinc-500">
            <a
              href="https://docs.anthropic.com/ko/docs/claude-code"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-zinc-900 dark:hover:text-white"
            >
              공식 문서
            </a>
            <a
              href="https://cc101.axwith.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-zinc-900 dark:hover:text-white"
            >
              cc101 (일반판)
            </a>
          </div>

          {/* Copyright */}
          <p className="text-xs text-zinc-300 dark:text-zinc-700">
            © {year} CC101 with FC · 패스트캠퍼스 클로드코드 뽀개기 강의 학습 가이드
          </p>
        </div>
      </div>
    </footer>
  )
}
