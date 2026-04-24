import type { AuthUser } from './auth-session'
import { getAuthToken } from './auth-session'
import type {
  BrandListResponse,
  CarouselsListResponse,
} from '../models/catalogue-landing'
import type { CategoryListResponse, Product, ProductListResponse } from '../models/product'

const DEFAULT_API = 'http://localhost:8180'

export function getApiBaseUrl(): string {
  const url = import.meta.env.VITE_API_URL
  if (typeof url === 'string' && url.length > 0) {
    return url.replace(/\/$/, '')
  }
  return DEFAULT_API
}

/** Starts the browser Google OAuth flow (API redirects to Google, then back to `/auth/callback`). */
export function getGoogleAuthStartUrl(redirectAfterLogin: string): string {
  const base = getApiBaseUrl()
  const path = sanitizeOAuthRedirectPath(redirectAfterLogin)
  const params = new URLSearchParams()
  if (path !== '/') {
    params.set('redirect', path)
  }
  const q = params.toString()
  return `${base}/api/v1/auth/google${q ? `?${q}` : ''}`
}

function sanitizeOAuthRedirectPath(path: string): string {
  const p = path.trim()
  if (p === '' || !p.startsWith('/') || p.startsWith('//')) {
    return '/'
  }
  return p
}

export async function readApiError(res: Response): Promise<string> {
  const data: unknown = await res.json().catch(() => ({}))
  if (
    typeof data === 'object' &&
    data !== null &&
    'error' in data &&
    typeof (data as { error: unknown }).error === 'string'
  ) {
    return (data as { error: string }).error
  }
  return `Request failed (${res.status})`
}

function authJsonHeaders(): HeadersInit {
  const t = getAuthToken()
  const h: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (t) h.Authorization = `Bearer ${t}`
  return h
}

export type LoginRequest = {
  email: string
  password: string
}

export type AuthResponse = {
  token: string
  user: AuthUser
}

export async function loginRequest(body: LoginRequest): Promise<AuthResponse> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data: unknown = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err =
      typeof data === 'object' &&
      data !== null &&
      'error' in data &&
      typeof (data as { error: unknown }).error === 'string'
        ? (data as { error: string }).error
        : 'Login failed'
    throw new Error(err)
  }
  return data as AuthResponse
}

export type RegisterRequest = {
  email: string
  password: string
  full_name: string
  company_name: string
  account_type: string
  rc_number?: string | null
  nif?: string | null
  state_id: number
  address: string
  phone: string
  user_type?: string
}

/** Public catalogue geo — matches serverside `PublicCountry`. */
export type CatalogueCountry = {
  id: number
  code: string
  name: string
  sort_order: number
}

/** Public catalogue geo — matches serverside `PublicState`. */
export type CatalogueState = {
  id: number
  country_id: number
  code: string
  name: string
  sort_order: number
  shipping_cents: number
}

export async function fetchCatalogueCountries(): Promise<{ items: CatalogueCountry[] }> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/catalogue/geo/countries`)
  if (!res.ok) throw new Error(await readApiError(res))
  return res.json() as Promise<{ items: CatalogueCountry[] }>
}

export async function fetchCatalogueStates(
  countryId: number,
): Promise<{ items: CatalogueState[] }> {
  const res = await fetch(
    `${getApiBaseUrl()}/api/v1/catalogue/geo/countries/${countryId}/states`,
  )
  if (!res.ok) throw new Error(await readApiError(res))
  return res.json() as Promise<{ items: CatalogueState[] }>
}

export async function registerRequest(body: RegisterRequest): Promise<AuthResponse> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data: unknown = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err =
      typeof data === 'object' &&
      data !== null &&
      'error' in data &&
      typeof (data as { error: unknown }).error === 'string'
        ? (data as { error: string }).error
        : 'Registration failed'
    throw new Error(err)
  }
  return data as AuthResponse
}

/** Thrown by `fetchMe` so callers can branch on HTTP status (e.g. 401 vs network). */
export class ApiHttpError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiHttpError'
    this.status = status
  }
}

export async function fetchMe(): Promise<AuthUser> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/me`, {
    headers: authJsonHeaders(),
  })
  if (!res.ok) {
    throw new ApiHttpError(await readApiError(res), res.status)
  }
  return res.json() as Promise<AuthUser>
}

/** Public category list for the storefront (signed image URLs when applicable). */
export async function fetchCatalogueCategories(params?: {
  page?: number
  perPage?: number
}): Promise<CategoryListResponse> {
  const page = params?.page ?? 1
  const perPage = params?.perPage ?? 100
  const searchParams = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  })
  const res = await fetch(`${getApiBaseUrl()}/api/v1/catalogue/categories?${searchParams}`)
  if (!res.ok) throw new Error(await readApiError(res))
  return res.json() as Promise<CategoryListResponse>
}

/** Public marketing carousel (active slides with images only). */
export async function fetchCatalogueCarousels(): Promise<CarouselsListResponse> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/catalogue/carousels`)
  if (!res.ok) throw new Error(await readApiError(res))
  return res.json() as Promise<CarouselsListResponse>
}

export async function fetchCatalogueBrands(params?: {
  page?: number
  perPage?: number
}): Promise<BrandListResponse> {
  const page = params?.page ?? 1
  const perPage = params?.perPage ?? 100
  const searchParams = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  })
  const res = await fetch(`${getApiBaseUrl()}/api/v1/catalogue/brands?${searchParams}`)
  if (!res.ok) throw new Error(await readApiError(res))
  return res.json() as Promise<BrandListResponse>
}

/** Unauthenticated list used by the public catalogue page. */
export async function fetchCatalogueProducts(params?: {
  page?: number
  perPage?: number
  /** Trims whitespace; omitted when empty. */
  q?: string
  categoryId?: number | null
  brandId?: number | null
  sort?: 'price_asc' | 'price_desc' | 'recent' | '' | string
  minPriceCents?: number | null
  maxPriceCents?: number | null
  /** When true, only products marked best seller (landing / highlights). */
  bestSeller?: boolean
}): Promise<ProductListResponse> {
  const page = params?.page ?? 1
  const perPage = params?.perPage ?? 12
  const searchParams = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  })
  const q = params?.q?.trim()
  if (q) searchParams.set('q', q)
  if (params?.categoryId != null && params.categoryId > 0) {
    searchParams.set('category_id', String(params.categoryId))
  }
  if (params?.brandId != null && params.brandId > 0) {
    searchParams.set('brand_id', String(params.brandId))
  }
  const sort = params?.sort?.trim()
  if (sort) searchParams.set('sort', sort)
  if (params?.minPriceCents != null && params.minPriceCents >= 0) {
    searchParams.set('min_price_cents', String(params.minPriceCents))
  }
  if (params?.maxPriceCents != null && params.maxPriceCents >= 0) {
    searchParams.set('max_price_cents', String(params.maxPriceCents))
  }
  if (params?.bestSeller === true) {
    searchParams.set('best_seller', 'true')
  }
  const res = await fetch(`${getApiBaseUrl()}/api/v1/catalogue/products?${searchParams}`)
  if (!res.ok) throw new Error(await readApiError(res))
  return res.json() as Promise<ProductListResponse>
}

export async function fetchCatalogueProduct(id: number): Promise<Product> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/catalogue/products/${id}`)
  if (!res.ok) throw new Error(await readApiError(res))
  return res.json() as Promise<Product>
}

export type CreateOrderRequest = {
  state_id: number
  city: string
  address: string
  contact_person: string
  phone: string
  instructions?: string
  items: Array<{
    product_id: number
    quantity: number
  }>
}

export type OrderItem = {
  id: number
  order_id: number
  product_id?: number | null
  pricing_tier_id?: number | null
  product_name: string
  product_image_url?: string
  category_name?: string
  tier_label?: string
  quantity: number
  unit_label?: string
  unit_weight_kg: number
  unit_price_cents: number
  line_subtotal_cents: number
  created_at: string
  updated_at: string
}

export type Order = {
  id: number
  order_number: string
  user_id: number
  customer_name: string
  company_name: string
  customer_email: string
  customer_phone: string
  account_type: string
  user_type: string
  rc_number?: string | null
  nif?: string | null
  state_id?: number | null
  state_name?: string
  country_name?: string
  wilaya?: string
  city: string
  address: string
  contact_person: string
  instructions?: string
  status: string
  subtotal_cents: number
  tax_cents: number
  shipping_cents: number
  total_cents: number
  admin_note?: string
  items?: OrderItem[]
  created_at: string
  updated_at: string
}

export type OrderListResponse = {
  items: Order[]
  pagination: {
    page: number
    per_page: number
    total_items: number
    total_pages: number
  }
}

export async function createOrderRequest(body: CreateOrderRequest): Promise<Order> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/orders`, {
    method: 'POST',
    headers: authJsonHeaders(),
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(await readApiError(res))
  return res.json() as Promise<Order>
}

export async function fetchMyOrders(params?: {
  page?: number
  perPage?: number
}): Promise<OrderListResponse> {
  const page = params?.page ?? 1
  const perPage = params?.perPage ?? 12
  const searchParams = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  })
  const res = await fetch(`${getApiBaseUrl()}/api/v1/orders?${searchParams}`, {
    headers: authJsonHeaders(),
  })
  if (!res.ok) throw new Error(await readApiError(res))
  return res.json() as Promise<OrderListResponse>
}

export async function fetchMyOrder(id: number): Promise<Order> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/orders/${id}`, {
    headers: authJsonHeaders(),
  })
  if (!res.ok) throw new Error(await readApiError(res))
  return res.json() as Promise<Order>
}
