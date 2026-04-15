/** Matches serverside `models.Category`. */
export type Category = {
  id: number
  name: string
  slug: string
  description?: string
  sort_order: number
  is_active: boolean
  icon_svg?: string
  parent_id?: number | null
  parent?: Category | null
  image_public_url?: string
  image_bucket_name?: string
  image_object_name?: string
  image_file_name?: string
  image_content_type?: string
  image_size_bytes?: number
  /** Non-persisted: set on category list from product counts. */
  product_count?: number
  created_at: string
  updated_at: string
}

export type CategoryListPagination = {
  page: number
  per_page: number
  total_items: number
  total_pages: number
}

export type CategoryListResponse = {
  items: Category[]
  pagination: CategoryListPagination
}

/** Matches serverside `models.PricingTier`. */
export type PricingTier = {
  id: number
  product_id: number
  label: string
  min_quantity: number
  price_cents: number
  is_highlighted: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type ProductImage = {
  id: number
  product_id: number
  public_url: string
  bucket_name: string
  object_name: string
  file_name: string
  content_type?: string
  size_bytes: number
  sort_order: number
  created_at: string
  updated_at: string
}

export type ProductSpecification = {
  id: number
  product_id: number
  spec_key: string
  spec_value: string
  created_at: string
  updated_at: string
}

export type Product = {
  id: number
  name: string
  description: string
  price_cents: number
  category_id?: number | null
  category?: Category | null
  created_at: string
  updated_at: string
  images?: ProductImage[]
  specifications?: ProductSpecification[]
  pricing_tiers?: PricingTier[]
}

export type ProductListPagination = {
  page: number
  per_page: number
  total_items: number
  total_pages: number
}

export type ProductListResponse = {
  items: Product[]
  pagination: ProductListPagination
}

export type ProductBadgeTone = 'primary' | 'secondary' | 'neutral'
export type ProductStockTone = 'primary' | 'secondary'

export type ProductBadge = {
  label: string
  tone: ProductBadgeTone
}

export type ProductPriceTier = {
  label: string
  amountDa: number
  highlighted?: boolean
}

// UI-focused model for catalogue cards.
export type CatalogueProductCard = {
  id: string
  imageUrl: string
  category: string
  name: string
  badges: ProductBadge[]
  priceTiers: ProductPriceTier[]
  stockLabel: string
  shippingLabel: string
  stockTone: ProductStockTone
}

export function formatDa(amountDa: number): string {
  return `${amountDa.toLocaleString('fr-FR')} DA`
}

const PLACEHOLDER_IMAGE =
  'https://placehold.co/600x400/e8e8e0/1B5E20?text=Fast-Agros'

function centsToDa(cents: number): number {
  return Math.round(cents / 100)
}

/** Map API product payload to card props for the catalogue grid. */
export function productToCatalogueCard(p: Product): CatalogueProductCard {
  const imageUrl = p.images?.[0]?.public_url ?? PLACEHOLDER_IMAGE

  const priceTiers: ProductPriceTier[] =
    p.pricing_tiers && p.pricing_tiers.length > 0
      ? p.pricing_tiers.map((t) => ({
          label: t.label,
          amountDa: centsToDa(t.price_cents),
          highlighted: t.is_highlighted,
        }))
      : [{ label: 'Prix', amountDa: centsToDa(p.price_cents), highlighted: true }]

  const badges: ProductBadge[] = []
  if (p.category?.name) {
    badges.push({ label: p.category.name, tone: 'primary' })
  }
  const originSpec = p.specifications?.find(
    (s) =>
      s.spec_key.toLowerCase() === 'origin' ||
      s.spec_key.toLowerCase() === 'origine',
  )
  if (originSpec?.spec_value) {
    badges.push({ label: originSpec.spec_value, tone: 'secondary' })
  }
  if (badges.length === 0) {
    badges.push({ label: 'Catalogue', tone: 'neutral' })
  }

  return {
    id: String(p.id),
    imageUrl,
    category: p.category?.name ?? 'Catalogue',
    name: p.name,
    badges: badges.slice(0, 3),
    priceTiers,
    stockLabel: 'Disponible',
    shippingLabel: 'Livraison B2B',
    stockTone: 'primary',
  }
}

