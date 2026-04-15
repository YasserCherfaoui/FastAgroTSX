import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard'
import ProductListItem from '../components/ProductListItem'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { fetchCatalogueCategories, fetchCatalogueProducts } from '../lib/api'
import { formatDa, productToCatalogueCard } from '../models/product'

export const Route = createFileRoute('/catalogue')({
  component: CataloguePage,
})

const PAGE_SIZE = 12
const PRICE_MAX_DA_DEFAULT = 250_000
const PRICE_STEP_DA = 1_000

function daToPriceCents(da: number): number {
  return Math.round(da * 100)
}

function CataloguePage() {
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebouncedValue(searchInput, 350)
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [sort, setSort] = useState<'price_asc' | 'price_desc' | 'recent' | ''>('')
  const [priceMinDa, setPriceMinDa] = useState(0)
  const [priceMaxDa, setPriceMaxDa] = useState(PRICE_MAX_DA_DEFAULT)
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const categoriesQuery = useQuery({
    queryKey: ['catalogue', 'categories'],
    queryFn: () => fetchCatalogueCategories({ page: 1, perPage: 200 }),
  })

  const filterParams = useMemo(() => {
    const minCents =
      priceMinDa > 0 ? daToPriceCents(priceMinDa) : null
    const maxCents =
      priceMaxDa < PRICE_MAX_DA_DEFAULT ? daToPriceCents(priceMaxDa) : null
    return {
      page,
      perPage: PAGE_SIZE,
      q: debouncedSearch,
      categoryId,
      sort,
      minPriceCents: minCents,
      maxPriceCents: maxCents,
    }
  }, [page, debouncedSearch, categoryId, sort, priceMinDa, priceMaxDa])

  const productsQuery = useQuery({
    queryKey: ['catalogue', 'products', filterParams],
    queryFn: () => fetchCatalogueProducts(filterParams),
  })

  const totalPages = productsQuery.data?.pagination.total_pages ?? 1
  useEffect(() => {
    if (page > totalPages) {
      setPage(Math.max(1, totalPages))
    }
  }, [page, totalPages])

  const categories = useMemo(() => {
    const raw = categoriesQuery.data?.items ?? []
    return raw.filter((c) => c.is_active).sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name))
  }, [categoriesQuery.data?.items])

  const selectedCategoryName = useMemo(() => {
    if (categoryId == null) return null
    return categories.find((c) => c.id === categoryId)?.name ?? null
  }, [categories, categoryId])

  const items = productsQuery.data?.items ?? []
  const pagination = productsQuery.data?.pagination
  const productsFound = pagination?.total_items ?? items.length
  const cards = items.map(productToCatalogueCard)

  const clearFilters = useCallback(() => {
    setPage(1)
    setSearchInput('')
    setCategoryId(null)
    setSort('')
    setPriceMinDa(0)
    setPriceMaxDa(PRICE_MAX_DA_DEFAULT)
  }, [])

  const hasActiveFilters =
    searchInput.trim() !== '' ||
    categoryId != null ||
    sort !== '' ||
    priceMinDa > 0 ||
    priceMaxDa < PRICE_MAX_DA_DEFAULT

  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = []
    if (searchInput.trim()) {
      chips.push({
        key: 'q',
        label: `« ${searchInput.trim().slice(0, 40)}${searchInput.trim().length > 40 ? '…' : ''} »`,
        onRemove: () => {
          setSearchInput('')
          setPage(1)
        },
      })
    }
    if (categoryId != null && selectedCategoryName) {
      chips.push({
        key: 'cat',
        label: selectedCategoryName,
        onRemove: () => {
          setCategoryId(null)
          setPage(1)
        },
      })
    }
    if (priceMinDa > 0 || priceMaxDa < PRICE_MAX_DA_DEFAULT) {
      chips.push({
        key: 'price',
        label: `${formatDa(priceMinDa)} — ${formatDa(priceMaxDa)}`,
        onRemove: () => {
          setPriceMinDa(0)
          setPriceMaxDa(PRICE_MAX_DA_DEFAULT)
          setPage(1)
        },
      })
    }
    if (sort) {
      const sortLabel =
        sort === 'price_asc'
          ? 'Prix ↑'
          : sort === 'price_desc'
            ? 'Prix ↓'
            : sort === 'recent'
              ? 'Récents'
              : sort
      chips.push({
        key: 'sort',
        label: sortLabel,
        onRemove: () => {
          setSort('')
          setPage(1)
        },
      })
    }
    return chips
  }, [
    searchInput,
    categoryId,
    selectedCategoryName,
    priceMinDa,
    priceMaxDa,
    sort,
  ])

  return (
    <main className="bg-(--surface) text-(--on-surface) min-h-screen font-sans">
      <section className="mx-auto flex max-w-screen-2xl flex-col gap-8 px-6 py-10 lg:flex-row lg:px-8">
        <aside className="hidden w-72 shrink-0 flex-col space-y-8 lg:flex">
          <div className="space-y-4">
            <button
              type="button"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className="text-primary w-full py-2 text-left text-xs font-bold tracking-widest uppercase disabled:opacity-40"
            >
              Effacer les filtres
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="font-headline border-(--surface-container-highest) border-b pb-2 text-sm font-bold tracking-tight">
              Catégories
            </h3>
            <div className="space-y-2">
              {categoriesQuery.isLoading ? (
                <p className="text-(--on-surface-variant) text-sm">Chargement…</p>
              ) : (
                <>
                  <label className="group flex cursor-pointer items-center justify-between rounded-lg py-1">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="catalogue-category"
                        className="border-(--outline-variant) text-primary h-4 w-4"
                        checked={categoryId == null}
                        onChange={() => {
                          setCategoryId(null)
                          setPage(1)
                        }}
                      />
                      <span className="text-(--on-surface-variant) text-sm group-hover:text-primary">
                        Toutes les catégories
                      </span>
                    </div>
                  </label>
                  {categories.map((cat) => (
                    <label
                      key={cat.id}
                      className="group flex cursor-pointer items-center justify-between rounded-lg py-1"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <input
                          type="radio"
                          name="catalogue-category"
                          className="border-(--outline-variant) text-primary h-4 w-4 shrink-0"
                          checked={categoryId === cat.id}
                          onChange={() => {
                            setCategoryId(cat.id)
                            setPage(1)
                          }}
                        />
                        <span className="text-(--on-surface-variant) truncate text-sm transition-colors group-hover:text-primary">
                          {cat.name}
                        </span>
                      </div>
                      {cat.product_count != null ? (
                        <span className="text-(--outline) shrink-0 text-xs font-bold">
                          {cat.product_count}
                        </span>
                      ) : null}
                    </label>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-headline border-(--surface-container-highest) border-b pb-2 text-sm font-bold tracking-tight">
              Gamme de prix (DA)
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-(--on-surface-variant) text-xs font-medium">
                  Minimum
                </label>
                <input
                  type="range"
                  min={0}
                  max={PRICE_MAX_DA_DEFAULT}
                  step={PRICE_STEP_DA}
                  value={priceMinDa}
                  onChange={(e) => {
                    const v = Number(e.target.value)
                    setPriceMinDa(Math.min(v, priceMaxDa))
                    setPage(1)
                  }}
                  className="bg-(--surface-container-highest) accent-primary h-1.5 w-full cursor-pointer appearance-none rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-(--on-surface-variant) text-xs font-medium">
                  Maximum
                </label>
                <input
                  type="range"
                  min={0}
                  max={PRICE_MAX_DA_DEFAULT}
                  step={PRICE_STEP_DA}
                  value={priceMaxDa}
                  onChange={(e) => {
                    const v = Number(e.target.value)
                    setPriceMaxDa(Math.max(v, priceMinDa))
                    setPage(1)
                  }}
                  className="bg-(--surface-container-highest) accent-primary h-1.5 w-full cursor-pointer appearance-none rounded-lg"
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="bg-(--surface-container-low) rounded px-2 py-1 font-mono text-xs font-bold">
                  {formatDa(priceMinDa)}
                </span>
                <span className="bg-(--surface-container-low) rounded px-2 py-1 font-mono text-xs font-bold">
                  {formatDa(priceMaxDa)}
                </span>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1 space-y-8">
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <nav className="text-(--outline) flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                <Link to="/" className="transition-colors hover:text-primary">
                  Accueil
                </Link>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="text-primary">Catalogue</span>
              </nav>
              <div className="flex flex-wrap items-center gap-4 md:gap-6">
                <div className="bg-(--surface-container-low) flex items-center gap-1 rounded-lg p-1">
                  <button
                    type="button"
                    title="Grille"
                    onClick={() => setView('grid')}
                    className={`rounded-md p-1.5 ${
                      view === 'grid'
                        ? 'bg-(--surface-container-lowest) text-primary shadow-sm'
                        : 'text-(--on-surface-variant) hover:bg-(--surface-container-highest)'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">grid_view</span>
                  </button>
                  <button
                    type="button"
                    title="Liste"
                    onClick={() => setView('list')}
                    className={`rounded-md p-1.5 ${
                      view === 'list'
                        ? 'bg-(--surface-container-lowest) text-primary shadow-sm'
                        : 'text-(--on-surface-variant) hover:bg-(--surface-container-highest)'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">list</span>
                  </button>
                </div>
                <div className="relative min-w-[200px]">
                  <select
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value as typeof sort)
                      setPage(1)
                    }}
                    className="bg-(--surface-container-lowest) focus:ring-primary w-full appearance-none rounded-lg border-none py-2 pr-10 pl-4 text-sm font-bold shadow-sm outline-none focus:ring-2"
                  >
                    <option value="">Tri par défaut</option>
                    <option value="price_asc">Prix croissant</option>
                    <option value="price_desc">Prix décroissant</option>
                    <option value="recent">Plus récents</option>
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute top-2 right-3 text-sm">
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            <div className="relative max-w-xl">
              <input
                type="search"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value)
                  setPage(1)
                }}
                placeholder="Rechercher un produit…"
                className="bg-(--surface-container-lowest) text-(--on-surface) focus:ring-primary h-12 w-full rounded-lg border-none pr-4 pl-11 text-sm shadow-sm focus:ring-2"
                autoComplete="off"
              />
              <span className="material-symbols-outlined text-(--on-surface-variant) absolute top-3 left-3">
                search
              </span>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <h1 className="font-headline text-primary text-3xl font-extrabold tracking-tight">
                {productsFound}{' '}
                <span className="text-(--on-surface-variant) text-lg font-normal">produits trouvés</span>
              </h1>
              {activeChips.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2">
                  {activeChips.map((chip) => (
                    <span
                      key={chip.key}
                      className="bg-(--primary-fixed) text-(--on-primary-fixed-variant) inline-flex items-center gap-1.5 rounded px-3 py-1 text-xs font-bold"
                    >
                      {chip.label}
                      <button
                        type="button"
                        className="material-symbols-outlined cursor-pointer text-[14px] leading-none"
                        onClick={chip.onRemove}
                        aria-label="Retirer le filtre"
                      >
                        close
                      </button>
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Mobile: filtres compacts */}
            <div className="space-y-4 rounded-xl border border-(--outline-variant) p-4 lg:hidden">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">Filtres</span>
                <button
                  type="button"
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                  className="text-primary text-xs font-bold uppercase disabled:opacity-40"
                >
                  Tout effacer
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-(--on-surface-variant) mb-1 text-xs font-medium">Catégorie</p>
                  <select
                    value={categoryId ?? ''}
                    onChange={(e) => {
                      const v = e.target.value
                      setCategoryId(v === '' ? null : Number(v))
                      setPage(1)
                    }}
                    className="bg-(--surface-container-lowest) w-full rounded-lg border-none px-3 py-2 text-sm"
                  >
                    <option value="">Toutes</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                        {c.product_count != null ? ` (${c.product_count})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-(--on-surface-variant) mb-1 text-xs font-medium">Prix min — max (DA)</p>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={0}
                      className="bg-(--surface-container-lowest) w-full rounded-lg border-none px-2 py-2 text-sm"
                      value={priceMinDa || ''}
                      placeholder="0"
                      onChange={(e) => {
                        const n = Number(e.target.value)
                        if (Number.isNaN(n)) return
                        setPriceMinDa(Math.max(0, Math.min(n, priceMaxDa)))
                        setPage(1)
                      }}
                    />
                    <input
                      type="number"
                      min={0}
                      className="bg-(--surface-container-lowest) w-full rounded-lg border-none px-2 py-2 text-sm"
                      value={priceMaxDa || ''}
                      placeholder={`${PRICE_MAX_DA_DEFAULT}`}
                      onChange={(e) => {
                        const n = Number(e.target.value)
                        if (Number.isNaN(n)) return
                        setPriceMaxDa(
                          Math.min(PRICE_MAX_DA_DEFAULT, Math.max(n, priceMinDa)),
                        )
                        setPage(1)
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {view === 'grid' ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {productsQuery.isLoading ? (
                <p className="text-(--on-surface-variant) col-span-full text-center text-sm">
                  Chargement du catalogue…
                </p>
              ) : productsQuery.isError ? (
                <p className="text-(--on-surface-variant) col-span-full text-center text-sm">
                  Impossible de charger les produits. Vérifiez que l&apos;API est disponible
                  {import.meta.env.DEV ? ` (${import.meta.env.VITE_API_URL ?? 'http://localhost:8180'})` : ''}.
                </p>
              ) : cards.length === 0 ? (
                <p className="text-(--on-surface-variant) col-span-full text-center text-sm">
                  Aucun produit ne correspond à ces critères.
                </p>
              ) : (
                cards.map((product) => <ProductCard key={product.id} product={product} />)
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {productsQuery.isLoading ? (
                <p className="text-(--on-surface-variant) text-center text-sm">
                  Chargement du catalogue…
                </p>
              ) : productsQuery.isError ? (
                <p className="text-(--on-surface-variant) text-center text-sm">
                  Impossible de charger les produits.
                </p>
              ) : cards.length === 0 ? (
                <p className="text-(--on-surface-variant) text-center text-sm">
                  Aucun produit ne correspond à ces critères.
                </p>
              ) : (
                cards.map((product) => (
                  <ProductListItem key={product.id} product={product} />
                ))
              )}
            </div>
          )}

          {totalPages > 1 && !productsQuery.isLoading ? (
            <nav className="flex flex-wrap items-center justify-center gap-3 pt-8">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="text-(--outline) hover:bg-(--surface-container-high) flex h-10 min-w-10 items-center justify-center rounded-lg transition-colors disabled:opacity-40"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <span className="text-(--on-surface-variant) px-2 text-sm font-medium tabular-nums">
                Page {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="text-(--on-surface) hover:bg-(--surface-container-high) flex h-10 min-w-10 items-center justify-center rounded-lg transition-colors disabled:opacity-40"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </nav>
          ) : null}
        </div>
      </section>
    </main>
  )
}
