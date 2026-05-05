import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

interface SectionMeta {
  id: string
  tier: string
  title: string
  subtitle: string
  file: string
}

interface SectionsConfig {
  sections: SectionMeta[]
  tiers: Record<string, { label: string }>
}

interface SearchEntry {
  id: string
  tier: string
  tier_label: string
  title: string
  subtitle: string
  headings: string[]
  url: string
}

function extractHeadings(markdown: string): string[] {
  return (markdown.match(/^## .+$/gm) ?? [])
    .map((line) =>
      line
        .replace(/^##\s+/, '')
        .replace(/^(?:[\p{Extended_Pictographic}\uFE0F\u200D]+\s*)+/u, '')
        .trim()
    )
    .filter(Boolean)
}

function readHeadings(file: string): string[] {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'content', file), 'utf-8')
    return extractHeadings(matter(raw).content)
  } catch {
    return []
  }
}

function buildSearchIndex(): SearchEntry[] {
  const raw = fs.readFileSync(path.join(process.cwd(), 'content', 'sections.json'), 'utf-8')
  const config = JSON.parse(raw) as SectionsConfig

  return config.sections.map((section) => ({
    id: section.id,
    tier: section.tier,
    tier_label: config.tiers[section.tier]?.label ?? '',
    title: section.title,
    subtitle: section.subtitle,
    headings: readHeadings(section.file),
    url: `/#${section.id}`,
  }))
}

const outputPath = path.join(process.cwd(), 'public', 'search-index.json')
fs.writeFileSync(outputPath, `${JSON.stringify(buildSearchIndex(), null, 2)}\n`, 'utf-8')
