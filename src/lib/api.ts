import type { AuthUser } from './auth-session'
import { getAuthToken } from './auth-session'
import type { CategoryListResponse, Product, ProductListResponse } from '../models/product'

const DEFAULT_API = 'http://localhost:8180'

export function getApiBaseUrl(): string {
  const url = import.meta.env.VITE_API_URL
  if (typeof url === 'string' && url.length > 0) {
    return url.replace(/\/$/, '')
  }
  return DEFAULT_API
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
  wilaya: string
  address: string
  phone: string
  user_type?: string
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

/** Unauthenticated list used by the public catalogue page. */
export async function fetchCatalogueProducts(params?: {
  page?: number
  perPage?: number
}): Promise<ProductListResponse> {
  const page = params?.page ?? 1
  const perPage = params?.perPage ?? 12
  const searchParams = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  })
  const res = await fetch(`${getApiBaseUrl()}/api/v1/catalogue/products?${searchParams}`)
  if (!res.ok) throw new Error(await readApiError(res))
  return res.json() as Promise<ProductListResponse>
}

export async function fetchCatalogueProduct(id: number): Promise<Product> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/catalogue/products/${id}`)
  if (!res.ok) throw new Error(await readApiError(res))
  return res.json() as Promise<Product>
}
