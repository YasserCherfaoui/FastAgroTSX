import { queryOptions, useQuery } from '@tanstack/react-query'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { fetchCatalogueProduct, fetchCatalogueProducts } from '../lib/api'
import { useCart } from '../lib/cart'
import { trackViewContent } from '../lib/meta-pixel'
import { type ProductSpecification, formatDa, productToCatalogueCard } from '../models/product'

function productDetailQueryOptions(productId: number) {
  return queryOptions({
    queryKey: ['catalogue', 'product', productId],
    queryFn: () => fetchCatalogueProduct(productId),
  })
}

export const Route = createFileRoute('/products/$productId')({
  loader: async ({ context, params }) => {
    const productId = Number(params.productId)
    if (!Number.isFinite(productId) || productId <= 0) return null

    await context.queryClient.ensureQueryData(productDetailQueryOptions(productId))
    return { productId }
  },
  component: ProductDetailsPage,
})

const PRODUCT_IMAGE_FALLBACK =
  'https://placehold.co/1200x900/e8e8e0/1B5E20?text=Fast-Agros'

function centsToDa(cents: number): number {
  return Math.round(cents / 100)
}

function normalizeKey(value: string): string {
  return value.trim().toLowerCase()
}

function isCompositionKey(key: string): boolean {
  return /(composition|ingredient|origine|origin|protein|proteine|humidity|humidite|moisture|calibre|grade|variete|variety)/.test(
    normalizeKey(key),
  )
}

function isStorageKey(key: string): boolean {
  return /(conservation|stockage|storage|shelf|dlc|dluo|temperature|temp|conditionnement)/.test(
    normalizeKey(key),
  )
}

function ProductSpecRow({
  specs,
  className = '',
}: {
  specs: ProductSpecification[]
  className?: string
}) {
  if (specs.length === 0) return null
  return (
    <div className={`flex min-w-0 flex-row flex-wrap gap-3 ${className}`.trim()}>
      {specs.map((spec) => (
        <div
          key={spec.id}
          className="bg-(--surface-container-low) min-w-0 flex-1 rounded-xl px-4 py-3"
        >
          <p className="m-0 text-[11px] font-bold tracking-[0.14em] uppercase">
            {spec.spec_key}
          </p>
          <p className="m-0 mt-2 text-sm text-(--on-surface)">{spec.spec_value}</p>
        </div>
      ))}
    </div>
  )
}

function ProductDetailsPage() {
  const { productId } = Route.useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const numericProductId = Number(productId)
  const isValidProductId = Number.isFinite(numericProductId) && numericProductId > 0

  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)

  const productQuery = useQuery({
    ...productDetailQueryOptions(numericProductId),
    enabled: isValidProductId,
  })

  const product = productQuery.data

  useEffect(() => {
    setSelectedImageIndex(0)
    setQuantity(1)
  }, [product?.id])

  useEffect(() => {
    if (!product) return
    const k = `meta_vc_${product.id}`
    try {
      if (sessionStorage.getItem(k)) return
      sessionStorage.setItem(k, '1')
    } catch {
      /* private mode */
    }
    trackViewContent({
      content_ids: [String(product.id)],
      value: centsToDa(product.price_cents),
      currency: 'DZD',
    })
  }, [product?.id])

  useEffect(() => {
    if (!justAdded) return
    const timer = window.setTimeout(() => setJustAdded(false), 1800)
    return () => window.clearTimeout(timer)
  }, [justAdded])

  const relatedProductsQuery = useQuery({
    queryKey: ['catalogue', 'related-products', product?.category_id ?? null, product?.id ?? null],
    queryFn: () =>
      fetchCatalogueProducts({
        page: 1,
        perPage: 5,
        categoryId: product?.category_id ?? null,
      }),
    enabled: Boolean(product?.category_id),
  })

  const images = useMemo(() => {
    const urls = product?.images?.map((image) => image.public_url).filter(Boolean) ?? []
    return urls.length > 0 ? urls : [PRODUCT_IMAGE_FALLBACK]
  }, [product?.images])

  const selectedImage = images[Math.min(selectedImageIndex, images.length - 1)] ?? PRODUCT_IMAGE_FALLBACK

  const sortedTiers = useMemo(() => {
    const tiers = product?.pricing_tiers ?? []
    if (tiers.length === 0) {
      return product
        ? [
            {
              id: product.id,
              label: 'Total estime',
              min_quantity: 1,
              price_cents: product.price_cents,
              is_highlighted: true,
              sort_order: 0,
              product_id: product.id,
              created_at: product.created_at,
              updated_at: product.updated_at,
            },
          ]
        : []
    }
    return [...tiers].sort((a, b) => a.sort_order - b.sort_order || a.min_quantity - b.min_quantity)
  }, [product])

  const activeTier =
    [...sortedTiers]
      .sort((a, b) => b.min_quantity - a.min_quantity || b.sort_order - a.sort_order)
      .find((tier) => quantity >= tier.min_quantity) ?? sortedTiers[0]

  const totalEstimateDa = activeTier ? centsToDa(activeTier.price_cents) * quantity : 0
  const productCard = product ? productToCatalogueCard(product) : null
  const outOfStock = productCard?.outOfStock ?? false

  const extraSpecs = useMemo(
    () =>
      (product?.specifications ?? []).filter(
        (spec) => !isCompositionKey(spec.spec_key) && !isStorageKey(spec.spec_key),
      ),
    [product?.specifications],
  )

  const relatedCards = useMemo(
    () =>
      (relatedProductsQuery.data?.items ?? [])
        .filter((item) => item.id !== product?.id)
        .slice(0, 4)
        .map(productToCatalogueCard),
    [product?.id, relatedProductsQuery.data?.items],
  )

  const handleAddToCart = () => {
    if (!productCard || outOfStock) return
    for (let index = 0; index < quantity; index += 1) {
      addItem(productCard)
    }
    setJustAdded(true)
  }

  const handleOrderNow = () => {
    if (outOfStock) return
    handleAddToCart()
    void navigate({ to: '/checkout' })
  }

  if (!isValidProductId) {
    return (
      <main className="min-h-screen bg-(--surface)">
        <section className="mx-auto max-w-[1360px] px-6 py-16 sm:px-8">
          <p className="text-(--on-surface-variant) text-sm">Produit invalide.</p>
        </section>
      </main>
    )
  }

  if (productQuery.isLoading) {
    return (
      <main className="min-h-screen bg-(--surface)">
        <section className="mx-auto max-w-[1360px] px-6 py-16 sm:px-8">
          <p className="text-(--on-surface-variant) text-sm">Chargement du produit…</p>
        </section>
      </main>
    )
  }

  if (productQuery.isError || !product) {
    return (
      <main className="min-h-screen bg-(--surface)">
        <section className="mx-auto max-w-[1360px] px-6 py-16 sm:px-8">
          <p className="text-(--on-surface-variant) text-sm">
            Impossible de charger ce produit.
          </p>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-(--surface) text-(--on-surface)">
      <section className="mx-auto max-w-[1360px] px-6 py-10 sm:px-8">
        <nav className="text-(--outline) mb-8 flex flex-wrap items-center gap-2 text-xs font-bold tracking-[0.14em] uppercase">
          <Link to="/" className="no-underline transition-colors hover:text-primary">
            Accueil
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link to="/catalogue" className="no-underline transition-colors hover:text-primary">
            Catalogue
          </Link>
          {product.category?.name ? (
            <>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span>{product.category.name}</span>
            </>
          ) : null}
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-primary">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <section className="space-y-6 lg:col-span-7">
            <div className="bg-(--surface-container-low) relative aspect-4/3 overflow-hidden rounded-3xl">
              <img
                src={selectedImage}
                alt={product.name}
                className="h-full w-full object-contain"
              />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {product.best_seller ? (
                  <span className="bg-(--primary-container) text-(--on-primary-container) rounded-sm px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
                    Best Seller
                  </span>
                ) : null}
                {product.category?.name ? (
                  <span className="bg-(--surface-container-lowest) text-primary rounded-sm px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
                    {product.category.name}
                  </span>
                ) : null}
              </div>
            </div>

            <section className="space-y-4 lg:hidden">
              <div>
                <p className="text-secondary m-0 mb-3 text-[11px] font-bold tracking-[0.2em] uppercase">
                  {product.category?.name ?? 'Catalogue'}
                </p>
                <h1 className="font-headline m-0 text-3xl leading-tight font-black tracking-[-0.03em] text-(--on-surface)">
                  {product.name}
                </h1>
                <ProductSpecRow specs={extraSpecs} className="mt-3" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="product-detail-quantity-mobile"
                    className="text-(--on-surface-variant) text-xs font-bold tracking-[0.14em] uppercase"
                  >
                    Quantite
                  </label>
                  <div className="bg-(--surface-container-lowest) flex h-12 items-center overflow-hidden rounded-xl">
                    <button
                      type="button"
                      onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                      disabled={outOfStock}
                      className="hover:bg-(--surface-container-highest) h-full px-4 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <input
                      id="product-detail-quantity-mobile"
                      type="number"
                      min={1}
                      value={quantity}
                      disabled={outOfStock}
                      onChange={(e) =>
                        setQuantity(Math.max(1, Number.parseInt(e.target.value || '1', 10) || 1))
                      }
                      className="w-full border-none bg-transparent text-center text-sm font-bold outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity((value) => value + 1)}
                      disabled={outOfStock}
                      className="hover:bg-(--surface-container-highest) h-full px-4 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                </div>

                <div className="bg-(--surface-container-low) rounded-[1.25rem] px-4 py-4">
                  <p className="text-(--on-surface-variant) m-0 text-[11px] font-bold tracking-[0.14em] uppercase">
                    Total estime
                  </p>
                  <p className="m-0 mt-2 text-sm font-bold text-(--on-surface)">
                    {activeTier?.label ?? 'Prix standard'} x {quantity} unite(s)
                  </p>
                  <p className="text-primary font-headline m-0 mt-2 text-2xl font-black">
                    {formatDa(totalEstimateDa)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={outOfStock}
                className="bg-(--secondary-container) text-(--on-secondary-container) flex h-14 w-full items-center justify-center gap-2 rounded-xl text-sm font-extrabold transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                <span className="material-symbols-outlined">shopping_cart</span>
                {outOfStock ? 'Rupture de stock' : 'Ajouter au panier'}
              </button>
            </section>

            {images.length > 1 ? (
              <div className="grid grid-cols-4 gap-4">
                {images.map((imageUrl, index) => (
                  <button
                    key={`${imageUrl}-${index}`}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square overflow-hidden rounded-xl transition ${
                      selectedImageIndex === index
                        ? 'ring-primary ring-2'
                        : 'hover:opacity-80'
                    }`}
                  >
                    <img
                      src={imageUrl}
                      alt={`${product.name} visuel ${index + 1}`}
                      className="h-full w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            ) : null}

            <section className="pt-10">
              <div className="space-y-5 text-sm leading-7 text-(--on-surface-variant)">
                <p>{product.description}</p>
              </div>
            </section>
          </section>

          <aside className="space-y-8 lg:col-span-5">
            <div className="hidden lg:block">
              <p className="text-secondary m-0 mb-3 text-[11px] font-bold tracking-[0.2em] uppercase">
                {product.category?.name ?? 'Catalogue'}
              </p>
              <h1 className="font-headline m-0 text-4xl leading-tight font-black tracking-[-0.03em] text-(--on-surface)">
                {product.name}
              </h1>
              <ProductSpecRow specs={extraSpecs} className="mt-4" />
              <p className="text-(--on-surface-variant) mt-3 text-sm leading-6">
                {product.description}
              </p>
            </div>

            <section className="bg-(--surface-container-low) rounded-3xl p-6">
              <p className="text-(--on-surface-variant) m-0 mb-4 text-[11px] font-bold tracking-[0.2em] uppercase">
                Tarifs Degressifs
              </p>
              <div className="space-y-3">
                {sortedTiers.map((tier) => {
                  const isActive = activeTier?.id === tier.id
                  return (
                    <div
                      key={tier.id}
                      className={`flex items-center justify-between rounded-xl px-4 py-4 ${
                        isActive
                          ? 'bg-primary'
                          : 'bg-(--surface-container-lowest)'
                      }`}
                    >
                      <div>
                        <p
                          className={`m-0 text-sm font-bold ${
                            isActive ? 'text-(--on-primary)' : ''
                          }`}
                        >
                          {tier.label}
                        </p>
                        <p
                          className={`m-0 mt-1 text-xs ${
                            isActive
                              ? 'text-(--on-primary)'
                              : 'text-(--outline)'
                          }`}
                          style={isActive ? { opacity: 0.82 } : undefined}
                        >
                          Des {Math.max(1, tier.min_quantity)} unite(s)
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-headline m-0 text-xl font-extrabold ${
                            isActive ? 'text-(--on-primary)' : ''
                          }`}
                        >
                          {formatDa(centsToDa(tier.price_cents))}
                        </p>
                        <p
                          className={`m-0 mt-1 text-[11px] ${
                            isActive ? 'text-(--on-primary)' : 'text-(--outline)'
                          }`}
                          style={isActive ? { opacity: 0.82 } : undefined}
                        >
                          / unite
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            <section className="space-y-6">
              <div className="hidden gap-4 sm:grid-cols-2 lg:grid">
                <div className="space-y-2">
                  <label
                    htmlFor="product-detail-quantity"
                    className="text-(--on-surface-variant) text-xs font-bold tracking-[0.14em] uppercase"
                  >
                    Quantite
                  </label>
                  <div className="bg-(--surface-container-lowest) flex h-12 items-center overflow-hidden rounded-xl">
                    <button
                      type="button"
                      onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                      disabled={outOfStock}
                      className="hover:bg-(--surface-container-highest) h-full px-4 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <input
                      id="product-detail-quantity"
                      type="number"
                      min={1}
                      value={quantity}
                      disabled={outOfStock}
                      onChange={(e) =>
                        setQuantity(Math.max(1, Number.parseInt(e.target.value || '1', 10) || 1))
                      }
                      className="w-full border-none bg-transparent text-center text-sm font-bold outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity((value) => value + 1)}
                      disabled={outOfStock}
                      className="hover:bg-(--surface-container-highest) h-full px-4 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                </div>

                <div className="bg-(--surface-container-low) rounded-[1.25rem] px-4 py-4">
                  <p className="text-(--on-surface-variant) m-0 text-[11px] font-bold tracking-[0.14em] uppercase">
                    Total estime
                  </p>
                  <p className="m-0 mt-2 text-sm font-bold text-(--on-surface)">
                    {activeTier?.label ?? 'Prix standard'} x {quantity} unite(s)
                  </p>
                  <p className="text-primary font-headline m-0 mt-2 text-2xl font-black">
                    {formatDa(totalEstimateDa)}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={outOfStock}
                  className="bg-(--secondary-container) text-(--on-secondary-container) hidden h-14 w-full items-center justify-center gap-2 rounded-xl text-sm font-extrabold transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 lg:flex"
                >
                  <span className="material-symbols-outlined">shopping_cart</span>
                  {outOfStock ? 'Rupture de stock' : 'Ajouter au panier'}
                </button>
                <button
                  type="button"
                  onClick={handleOrderNow}
                  disabled={outOfStock}
                  className="text-primary border-primary flex h-14 w-full items-center justify-center gap-2 rounded-xl border-2 text-sm font-extrabold transition-colors hover:bg-[color-mix(in_oklab,var(--primary)_8%,transparent)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="material-symbols-outlined">bolt</span>
                  {outOfStock ? 'Rupture de stock' : 'Commander directement'}
                </button>
                {justAdded ? (
                  <p className="text-primary m-0 text-center text-xs font-bold tracking-[0.12em] uppercase">
                    Produit ajoute au panier
                  </p>
                ) : null}
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
              <article className="bg-(--surface-container-low) flex items-start gap-3 rounded-[1.25rem] p-4">
                <span className="material-symbols-outlined text-primary">local_shipping</span>
                <div>
                  <p className="m-0 text-sm font-bold">Livraison nationale</p>
                  <p className="text-(--on-surface-variant) m-0 mt-1 text-xs">
                    Expedition rapide selon la zone desservie.
                  </p>
                </div>
              </article>
              <article className="bg-(--surface-container-low) flex items-start gap-3 rounded-[1.25rem] p-4">
                <span className="material-symbols-outlined text-primary">inventory_2</span>
                <div>
                  <p className="m-0 text-sm font-bold">Commande pro</p>
                  <p className="text-(--on-surface-variant) m-0 mt-1 text-xs">
                    Tarification adaptee aux volumes et recurrent.
                  </p>
                </div>
              </article>
            </section>
          </aside>
        </div>
      </section>

      <section className="bg-(--surface-container-low) px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-[1360px]">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-secondary m-0 mb-2 text-[11px] font-bold tracking-[0.2em] uppercase">
                Suggestions
              </p>
              <h2 className="font-headline m-0 text-3xl font-black tracking-tight">
                Produits similaires
              </h2>
            </div>
          </div>

          {relatedProductsQuery.isLoading ? (
            <p className="text-(--on-surface-variant) text-sm">Chargement des suggestions…</p>
          ) : relatedCards.length === 0 ? (
            <p className="text-(--on-surface-variant) text-sm">
              Aucun autre produit similaire n&apos;est disponible pour le moment.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {relatedCards.map((related) => (
                <ProductCard key={related.id} product={related} onAddToCart={addItem} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
