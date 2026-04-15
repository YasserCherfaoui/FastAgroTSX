import type { Product, ProductListResponse } from '../models/product'

const DEFAULT_API = 'http://localhost:8180'

export function getApiBaseUrl(): string {
  const url = import.meta.env.VITE_API_URL
  if (typeof url === 'string' && url.length > 0) {
    return url.replace(/\/$/, '')
  }
  return DEFAULT_API
}

async function readApiError(res: Response): Promise<string> {
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
