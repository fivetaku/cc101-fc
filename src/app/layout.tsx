import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'CC101 with FC — 패스트캠퍼스 클로드코드 뽀개기',
  description:
    '패스트캠퍼스 "클로드코드 뽀개기" 강의 수강생을 위한 한국어 학습 가이드. Part 1~3 17 클립 + 보조 레퍼런스. 영상 보면서 옆에 켜두고 따라하세요.',
  keywords: 'Claude Code, 클로드코드, 한국어, 패스트캠퍼스, 강의, 가이드, AI, Anthropic',
  authors: [{ name: 'CC101 with FC' }],
  openGraph: {
    title: 'CC101 with FC — 패스트캠퍼스 클로드코드 뽀개기',
    description: '패스트캠퍼스 클로드코드 뽀개기 강의 학습 가이드',
    url: 'https://cc101-fc.axwith.com',
    siteName: 'CC101 with FC',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: 'https://cc101-fc.axwith.com/og.png',
        width: 1200,
        height: 630,
        alt: 'CC101 with FC — 패스트캠퍼스 클로드코드 뽀개기',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CC101 with FC — 패스트캠퍼스 클로드코드 뽀개기',
    description: '패스트캠퍼스 클로드코드 뽀개기 강의 학습 가이드',
    images: ['https://cc101-fc.axwith.com/og.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <Script src="/theme-init.js" strategy="beforeInteractive" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        {/* Google Analytics 4 — only on production domain. ID는 Step J에서 신규 발급 */}
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            if (location.hostname === 'cc101-fc.axwith.com') {
              var GA4_ID = 'G-XXXXXXX'; // TODO: Step J에서 신규 GA4 property 발급 후 교체
              var s = document.createElement('script');
              s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
              s.async = true;
              document.head.appendChild(s);
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', GA4_ID);
            }
          `}
        </Script>
      </body>
    </html>
  )
}
