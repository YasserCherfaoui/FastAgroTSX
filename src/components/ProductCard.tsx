import { Link } from '@tanstack/react-router'
import type { CatalogueProductCard } from '../models/product'
import { formatDa } from '../models/product'
import { catalogueBadgeChipStyle, catalogueBadgeToneClass } from '../lib/product-badge-styles'

type ProductCardProps = {
  product: CatalogueProductCard
  onAddToCart?: (product: CatalogueProductCard) => void
  isJustAdded?: boolean
}

export default function ProductCard({ product, onAddToCart, isJustAdded = false }: ProductCardProps) {
  return (
    <article className="bg-(--surface-container-lowest) group overflow-hidden rounded-xl transition-all duration-300 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)]">
      <Link to="/products/$productId" params={{ productId: product.id }} className="block no-underline">
        <div className="bg-(--surface-container-low) relative h-56 overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-contain"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            {product.badges.map((badge) => (
              <span
                key={`${product.id}-${badge.label}`}
                className={`rounded-sm px-3 py-1 text-[10px] font-bold tracking-widest uppercase ${
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
      <div className="space-y-6 p-6">
        <div>
          <p className="text-secondary mb-1 text-xs font-bold tracking-widest uppercase">
            {product.category}
          </p>
          <Link
            to="/products/$productId"
            params={{ productId: product.id }}
            className="text-inherit no-underline"
          >
            <h3 className="font-headline text-xl font-bold text-(--on-surface) transition-colors group-hover:text-primary">
              {product.name}
            </h3>
          </Link>
        </div>
        <div className="space-y-2">
          {product.priceTiers.map((tier) => (
            <div
              key={`${product.id}-${tier.label}`}
              className={`flex items-center justify-between rounded-lg p-3 ${
                tier.highlighted
                  ? 'bg-(--primary-container) text-white'
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
          onClick={() => onAddToCart?.(product)}
            className="bg-(--on-surface) text-(--surface) hover:bg-primary hover:text-(--on-primary) flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold transition-colors"
        >
          <span className="material-symbols-outlined text-sm">shopping_cart</span>
          Ajouter au panier
        </button>
        {isJustAdded ? (
          <p className="text-primary m-0 -mt-2 text-xs font-bold tracking-[0.08em] uppercase">
            Produit ajoute au panier
          </p>
        ) : null}
      </div>
    </article>
  )
}

