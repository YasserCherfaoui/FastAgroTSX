/** Meta Pixel helpers (browser only). */

declare global {
  interface Window {
    fbq?: (
      action: 'init' | 'track' | 'trackCustom',
      event: string,
      params?: Record<string, unknown>,
    ) => void
  }
}

const CURRENCY = 'DZD'

export function isMetaPixelEnabled(): boolean {
  if (typeof window === 'undefined') return false
  if (import.meta.env.VITE_META_PIXEL_DISABLED === 'true') return false
  const id = import.meta.env.VITE_META_PIXEL_ID
  return typeof id === 'string' && id.length > 0
}

/** Inline bootstrap: load fbevents.js, init pixel, first PageView. */
export function getMetaPixelBootstrapScript(): string | null {
  const id = import.meta.env.VITE_META_PIXEL_ID
  if (!id || import.meta.env.VITE_META_PIXEL_DISABLED === 'true') return null
  return `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${id}');
fbq('track', 'PageView');`
}

export function getMetaPixelNoscriptUrl(): string | null {
  const id = import.meta.env.VITE_META_PIXEL_ID
  if (!id || import.meta.env.VITE_META_PIXEL_DISABLED === 'true') return null
  return `https://www.facebook.com/tr?id=${encodeURIComponent(id)}&ev=PageView&noscript=1`
}

function fbqTrack(event: string, params?: Record<string, unknown>) {
  if (!isMetaPixelEnabled() || typeof window === 'undefined') return
  window.fbq?.('track', event, params)
}

export function trackPageView() {
  fbqTrack('PageView')
}

export function trackViewContent(params: {
  content_ids: string[]
  value: number
  currency?: string
}) {
  fbqTrack('ViewContent', {
    content_ids: params.content_ids,
    content_type: 'product',
    value: params.value,
    currency: params.currency ?? CURRENCY,
  })
}

export function trackAddToCart(params: {
  content_ids: string[]
  value: number
  num_items?: number
  currency?: string
}) {
  fbqTrack('AddToCart', {
    content_ids: params.content_ids,
    content_type: 'product',
    value: params.value,
    currency: params.currency ?? CURRENCY,
    num_items: params.num_items ?? 1,
  })
}

export function trackInitiateCheckout(params: {
  value: number
  num_items: number
  content_ids?: string[]
  currency?: string
}) {
  fbqTrack('InitiateCheckout', {
    value: params.value,
    currency: params.currency ?? CURRENCY,
    num_items: params.num_items,
    ...(params.content_ids?.length
      ? { content_ids: params.content_ids, content_type: 'product' as const }
      : {}),
  })
}

export function trackPurchase(params: {
  value: number
  content_ids: string[]
  event_id: string
  currency?: string
}) {
  fbqTrack('Purchase', {
    value: params.value,
    currency: params.currency ?? CURRENCY,
    content_ids: params.content_ids,
    content_type: 'product',
    event_id: params.event_id,
  })
}
