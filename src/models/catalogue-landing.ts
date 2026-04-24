/** Matches serverside `models.Carousel` (public catalogue). */
export type CatalogueCarousel = {
  id: number
  title?: string
  subtitle?: string
  cta_text?: string
  cta_url?: string
  sort_order: number
  is_active: boolean
  image_public_url?: string
  image_bucket_name?: string
  image_object_name?: string
  image_file_name?: string
  image_content_type?: string
  image_size_bytes?: number
  created_at: string
  updated_at: string
}

export type CarouselsListResponse = {
  items: CatalogueCarousel[]
}

/** Matches serverside `models.Brand` (list payload). */
export type CatalogueBrand = {
  id: number
  name: string
  slug: string
  brand_image?: string
  parent_id?: number | null
  parent?: CatalogueBrand | null
  created_at: string
  updated_at: string
}

export type BrandListPagination = {
  page: number
  per_page: number
  total_items: number
  total_pages: number
}

export type BrandListResponse = {
  items: CatalogueBrand[]
  pagination: BrandListPagination
}
