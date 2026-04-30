import { Link } from '@tanstack/react-router'
import { catalogueBadgeChipStyle, catalogueBadgeToneClass } from '../lib/product-badge-styles'
import type { CatalogueProductCard } from '../models/product'
import { formatDa } from '../models/product'

type ProductListItemProps = {
  product: CatalogueProductCard
  onAddToCart?: (product: CatalogueProductCard) => void
  isJustAdded?: boolean
}

export default function ProductListItem({
  product,
  onAddToCart,
  isJustAdded = false,
}: ProductListItemProps) {
  const highlightTier = product.priceTiers.find((t) => t.highlighted) ?? product.priceTiers[0]

  return (
    <article className="bg-(--surface-container-lowest) flex flex-col gap-4 rounded-xl p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-stretch">
      <Link
        to="/products/$productId"
        params={{ productId: product.id }}
        className="block shrink-0 no-underline"
      >
        <div className="bg-(--surface-container-low) relative h-44 w-full overflow-hidden rounded-lg sm:h-32 sm:w-48">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-contain"
          />
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {product.badges.slice(0, 2).map((badge) => (
              <span
                key={`${product.id}-${badge.label}`}
                className={`rounded-sm px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase ${
                  badge.chipBackgroundHex ? '' : catalogueBadgeToneClass(badge.tone)
                }`}
                style={catalogueBadgeChipStyle(badge)}
              >
                {badge.label}
              </span>
            ))}
          </div>
        </div>
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        <div>
          <p className="text-secondary mb-1 text-[10px] font-bold tracking-widest uppercase">
            {product.category}
          </p>
          <Link
            to="/products/$productId"
            params={{ productId: product.id }}
            className="text-inherit no-underline"
          >
            <h3 className="font-headline text-lg font-bold text-(--on-surface) hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          {highlightTier ? (
            <p className="text-primary mt-1 font-headline text-lg font-extrabold">
              {formatDa(highlightTier.amountDa)}
              <span className="text-(--on-surface-variant) ml-2 text-xs font-normal">
                {highlightTier.label}
              </span>
            </p>
          ) : null}
        </div>
        <div className="text-(--on-surface-variant) flex flex-wrap items-center gap-2 text-xs">
          <span className="flex items-center gap-1">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                product.stockTone === 'secondary' ? 'bg-secondary' : 'bg-primary'
              }`}
            />
            {product.stockLabel}
          </span>
          <span className="text-(--outline-variant)">|</span>
          <span>{product.shippingLabel}</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center sm:w-44">
        <div className="w-full space-y-2">
          <button
            type="button"
            onClick={() => onAddToCart?.(product)}
            className="bg-(--on-surface) text-(--surface) hover:bg-primary hover:text-(--on-primary) w-full rounded-lg py-3 text-sm font-bold transition-colors"
          >
            Ajouter au panier
          </button>
          {isJustAdded ? (
            <p className="text-primary m-0 text-center text-[11px] font-bold tracking-[0.08em] uppercase">
              Ajoute au panier
            </p>
          ) : null}
        </div>
      </div>
    </article>
  )
}
