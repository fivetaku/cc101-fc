import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { SectionMeta, SectionsConfig, SectionFrontmatter } from '@/types'

const contentDir = path.join(process.cwd(), 'content')

export function getSectionsConfig(): SectionsConfig {
  const configPath = path.join(contentDir, 'sections.json')
  const raw = fs.readFileSync(configPath, 'utf-8')
  return JSON.parse(raw) as SectionsConfig
}

export function getSectionMetas(): SectionMeta[] {
  const config = getSectionsConfig()
  return [...config.sections].sort((a, b) => a.order - b.order)
}

/**
 * 마크다운 본문 첫 H1과 그 다음 blockquote/hr 블록을 제거.
 * SectionBlock 헤더가 같은 정보(제목·메타)를 이미 표시하므로 중복 방지.
 */
function stripLeadingHeader(body: string): string {
  let out = body
  out = out.replace(/^\s*#\s+.+\n+/m, '')
  out = out.replace(/^(>\s*.*\n?)+\n?/m, '')
  out = out.replace(/^\s*---\s*\n+/m, '')
  return out.trimStart()
}

export function getSectionMarkdown(section: SectionMeta): {
  markdown: string
  frontmatter: SectionFrontmatter
} {
  const filePath = path.join(contentDir, section.file)

  let raw = ''
  try {
    raw = fs.readFileSync(filePath, 'utf-8')
  } catch {
    return {
      markdown: `콘텐츠 준비 중입니다.`,
      frontmatter: {},
    }
  }

  const { content, data } = matter(raw)
  return {
    markdown: stripLeadingHeader(content),
    frontmatter: data as SectionFrontmatter,
  }
}

export function getAllSectionMarkdowns(): Array<{
  meta: SectionMeta
  markdown: string
  frontmatter: SectionFrontmatter
}> {
  const metas = getSectionMetas()
  return metas.map((meta) => ({
    meta,
    ...getSectionMarkdown(meta),
  }))
}
