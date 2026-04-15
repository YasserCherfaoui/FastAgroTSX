import type { CSSProperties } from 'react'
import type { CatalogueProductCard } from '../models/product'
import { formatDa, hexToContrastingForeground } from '../models/product'

type ProductCardProps = {
  product: CatalogueProductCard
  onAddToQuote?: (product: CatalogueProductCard) => void
}

function badgeToneClass(tone: CatalogueProductCard['badges'][number]['tone']): string {
  if (tone === 'primary') return 'bg-primary text-(--on-primary)'
  if (tone === 'secondary') return 'bg-secondary text-(--on-secondary)'
  return 'bg-(--on-surface) text-(--surface)'
}

function badgeChipStyle(badge: CatalogueProductCard['badges'][number]): CSSProperties | undefined {
  if (!badge.chipBackgroundHex) return undefined
  return {
    backgroundColor: badge.chipBackgroundHex,
    color: hexToContrastingForeground(badge.chipBackgroundHex),
  }
}

export default function ProductCard({ product, onAddToQuote }: ProductCardProps) {
  return (
    <article className="bg-(--surface-container-lowest) group overflow-hidden rounded-xl transition-all duration-300 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)]">
      <div className="relative h-56 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          {product.badges.map((badge) => (
            <span
              key={`${product.id}-${badge.label}`}
              className={`rounded-sm px-3 py-1 text-[10px] font-bold tracking-widest uppercase ${
                badge.chipBackgroundHex ? '' : badgeToneClass(badge.tone)
              }`}
              style={badgeChipStyle(badge)}
            >
              {badge.label}
            </span>
          ))}
        </div>
      </div>
      <div className="space-y-6 p-6">
        <div>
          <p className="text-secondary mb-1 text-xs font-bold tracking-widest uppercase">
            {product.category}
          </p>
          <h3 className="font-headline text-xl font-bold text-(--on-surface)">{product.name}</h3>
        </div>
        <div className="space-y-2">
          {product.priceTiers.map((tier) => (
            <div
              key={`${product.id}-${tier.label}`}
              className={`flex items-center justify-between rounded-lg p-3 ${
                tier.highlighted
                  ? 'bg-(--primary-container) text-(--on-primary)'
                  : 'bg-(--surface-container-low)'
              }`}
            >
              <span
                className={`text-xs font-medium ${
                  tier.highlighted ? 'opacity-90' : 'text-(--on-surface-variant)'
                }`}
              >
                {tier.label}
              </span>
              <span className={`font-headline font-extrabold ${tier.highlighted ? '' : 'text-primary'}`}>
                {formatDa(tier.amountDa)}
              </span>
            </div>
          ))}
        </div>
        <div className="text-(--on-surface-variant) flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                product.stockTone === 'secondary' ? 'bg-secondary' : 'bg-primary'
              }`}
            />
            <span>{product.stockLabel}</span>
          </div>
          <span className="text-(--outline-variant)">|</span>
          <span>{product.shippingLabel}</span>
        </div>
        <button
          type="button"
          onClick={() => onAddToQuote?.(product)}
          className="bg-(--on-surface) text-(--surface) hover:bg-primary flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold transition-colors"
        >
          <span className="material-symbols-outlined text-sm">request_quote</span>
          Ajouter au devis
        </button>
      </div>
    </article>
  )
}

