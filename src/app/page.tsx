import { Suspense } from 'react'
import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import {
  getSectionsConfig,
  getSectionMetas,
  getAllSectionMarkdowns,
} from '@/lib/content'
import { PageClient } from '@/components/PageClient'
import { SectionBlock } from '@/components/SectionBlock'
import { CodeBlock } from '@/components/CodeBlock'

export const metadata: Metadata = {
  title: 'CC101 with FC — 패스트캠퍼스 클로드코드 뽀개기',
  description:
    '패스트캠퍼스 클로드코드 뽀개기 강의 수강생을 위한 한국어 학습 가이드. Part 1~3 17 클립 + 보조 레퍼런스.',
}

export default function Page() {
  const config = getSectionsConfig()
  const sections = getSectionMetas()
  const sectionContents = getAllSectionMarkdowns()

  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <PageClient sections={sections} tiers={config.tiers}>
        {sectionContents.map(({ meta, markdown, frontmatter }) => (
          <SectionBlock
            key={meta.id}
            id={meta.id}
            order={meta.order}
            tier={meta.tier}
            title={meta.title}
            subtitle={meta.subtitle}
            part={meta.part}
            clip={meta.clip}
            badge={meta.badge}
            type={meta.type}
            frontmatter={frontmatter}
          >
            <MDXRemote
              source={markdown}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              components={{ pre: CodeBlock as any }}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                },
              }}
            />
          </SectionBlock>
        ))}
      </PageClient>
    </Suspense>
  )
}
