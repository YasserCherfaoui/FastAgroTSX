import type { CSSProperties } from 'react'

import type { CatalogueProductCard } from '../models/product'
import { hexToContrastingForeground } from '../models/product'

export type CatalogueBadge = CatalogueProductCard['badges'][number]

export function catalogueBadgeToneClass(tone: CatalogueBadge['tone']): string {
  if (tone === 'primary') return 'bg-primary text-(--on-primary)'
  if (tone === 'secondary') return 'bg-secondary text-(--on-secondary)'
  return 'bg-(--on-surface) text-(--surface)'
}

export function catalogueBadgeChipStyle(badge: CatalogueBadge): CSSProperties | undefined {
  if (!badge.chipBackgroundHex) return undefined
  return {
    backgroundColor: badge.chipBackgroundHex,
    color: hexToContrastingForeground(badge.chipBackgroundHex),
  }
}
