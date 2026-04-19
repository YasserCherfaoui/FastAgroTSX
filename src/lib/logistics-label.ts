import { formatDa } from '../models/product'

/**
 * When delivery is free for a zone, show an explicit message naming the state/wilaya.
 */
export function formatShippingLine(opts: {
  feeDa: number
  shippingCents: number
  stateName?: string | null
  /** e.g. empty cart — show 0 DZD, not a “free delivery” line */
  suppressFreeMessage?: boolean
}): string {
  const name = opts.stateName?.trim()
  if (
    !opts.suppressFreeMessage &&
    opts.shippingCents === 0 &&
    name
  ) {
    return `Free delivery on ${name}`
  }
  return formatDa(opts.feeDa)
}
