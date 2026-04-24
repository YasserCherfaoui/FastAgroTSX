/** Google Analytics 4 (gtag.js) — browser only. */

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

function getMeasurementId(): string | undefined {
  const id = import.meta.env.VITE_GA4_MEASUREMENT_ID
  return typeof id === 'string' && id.length > 0 ? id : undefined
}

export function isGoogleAnalyticsEnabled(): boolean {
  if (typeof window === 'undefined') return false
  if (import.meta.env.VITE_GA4_DISABLED === 'true') return false
  return getMeasurementId() !== undefined
}

/** URL for the async gtag.js loader, or `null` when GA is off. */
export function getGtagJsSrc(): string | null {
  const id = getMeasurementId()
  if (!id || import.meta.env.VITE_GA4_DISABLED === 'true') return null
  return `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
}

/** Inline bootstrap: `dataLayer`, `gtag`, and initial `config` (default page_view). */
export function getGtagInitScript(): string | null {
  const id = getMeasurementId()
  if (!id || import.meta.env.VITE_GA4_DISABLED === 'true') return null
  return `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(id)});`
}

/**
 * Fires a GA4 `page_view` for SPA navigations. Initial document load is covered
 * by `getGtagInitScript` (`config`).
 */
export function trackPageView(pathname: string) {
  if (!isGoogleAnalyticsEnabled() || typeof window === 'undefined') return
  const loc = window.location
  const page_location = `${loc.origin}${loc.pathname}${loc.search}${loc.hash}`
  window.gtag?.('event', 'page_view', {
    page_path: pathname,
    page_location,
  })
}
