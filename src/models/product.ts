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
  created_at: string
  updated_at: string
  images: ProductImage[]
  specifications: ProductSpecification[]
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

