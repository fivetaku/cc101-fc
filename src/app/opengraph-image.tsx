import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'

export const alt = 'CC101 with FC — 패스트캠퍼스 클로드코드 뽀개기'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: '#09090b',
          backgroundImage:
            'radial-gradient(ellipse at 25% 0%, rgba(255, 0, 60, 0.55) 0%, rgba(9, 9, 11, 0) 55%), radial-gradient(ellipse at 90% 100%, rgba(255, 58, 102, 0.35) 0%, rgba(9, 9, 11, 0) 55%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
          padding: 96,
        }}
      >
        {/* Top brand row — CSS triangle + text */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            color: '#ff003c',
            fontSize: 32,
            fontWeight: 700,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: '12px solid transparent',
              borderBottom: '12px solid transparent',
              borderLeft: '20px solid #ff003c',
            }}
          />
          <span>CC101 with FC</span>
        </div>

        {/* Main title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: 96,
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: -3,
            marginBottom: 36,
            color: '#ffffff',
          }}
        >
          <div style={{ display: 'flex' }}>
            <span style={{ color: '#ff003c' }}>Claude Code</span>
            <span>로</span>
          </div>
          <div>AI 시작하기</div>
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: 'flex',
            fontSize: 36,
            color: '#a1a1aa',
            fontWeight: 500,
          }}
        >
          Fastcampus 클로드코드 뽀개기 — 학습 가이드
        </div>

        {/* Bottom stats row */}
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            right: 96,
            display: 'flex',
            gap: 32,
            color: '#71717a',
            fontSize: 22,
            fontWeight: 600,
          }}
        >
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: '#ff003c' }}>17</span>
            <span>클립</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: '#ff003c' }}>4</span>
            <span>레퍼런스</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
