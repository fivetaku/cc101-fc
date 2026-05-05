export type SectionTier = 'part-1' | 'part-2' | 'part-3' | 'reference'

export type SectionType = 'lecture' | 'reference'

export interface SectionMeta {
  id: string
  tier: SectionTier
  part: number | null
  clip: number | null
  order: number
  slug: string
  title: string
  subtitle: string
  duration_min: number | null
  icon: string
  badge: string | null
  file: string
  type: SectionType
}

export interface SectionFrontmatter {
  course_clip_ref?: string
  result_path?: string
  next_clip_id?: string
}

export interface SectionContent {
  meta: SectionMeta
  markdown: string
  frontmatter: SectionFrontmatter
}

export interface TierMeta {
  label: string
  description: string
  count: number
  order: number
}

export interface SectionsConfig {
  site: {
    name: string
    url: string
    description: string
    course_version: string
    version: string
    lastUpdated: string
  }
  sections: SectionMeta[]
  tiers: Record<SectionTier, TierMeta>
}
