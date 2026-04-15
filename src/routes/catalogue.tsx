import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import ProductCard from '../components/ProductCard'
import { fetchCatalogueProducts } from '../lib/api'
import { productToCatalogueCard } from '../models/product'

export const Route = createFileRoute('/catalogue')({
  component: CataloguePage,
})

function CataloguePage() {
  const productsQuery = useQuery({
    queryKey: ['catalogue', 'products', { page: 1, perPage: 12 }],
    queryFn: () => fetchCatalogueProducts({ page: 1, perPage: 12 }),
  })

  const items = productsQuery.data?.items ?? []
  const productsFound = productsQuery.data?.pagination.total_items ?? items.length
  const cards = items.map(productToCatalogueCard)

  return (
    <main className="bg-(--surface) text-(--on-surface) min-h-screen font-sans">
      <section className="mx-auto flex max-w-screen-2xl gap-8 px-8 py-10">
        <aside className="hidden w-72 shrink-0 flex-col space-y-8 lg:flex">
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                className="bg-(--surface-container-lowest) text-(--on-surface) focus:ring-primary h-11 w-full rounded-lg border-none pr-4 pl-11 text-sm shadow-sm focus:ring-2"
              />
              <span className="material-symbols-outlined text-(--on-surface-variant) absolute top-2.5 left-3">
                search
              </span>
            </div>
            <button className="text-primary w-full py-2 text-left text-xs font-bold tracking-widest uppercase">
              Effacer les filtres
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="font-headline border-(--surface-container-highest) border-b pb-2 text-sm font-bold tracking-tight">
              Categories
            </h3>
            <div className="space-y-3">
              {(
                [
                  ['Legumes frais', '84', true],
                  ['Fruits de saison', '56', false],
                  ['Cereales & Grains', '42', false],
                ] as const
              ).map(([name, count, checked]) => (
                <label key={name} className="group flex cursor-pointer items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      defaultChecked={Boolean(checked)}
                      className="border-(--outline-variant) text-primary h-4 w-4 rounded"
                    />
                    <span className="text-(--on-surface-variant) text-sm transition-colors group-hover:text-primary">
                      {name}
                    </span>
                  </div>
                  <span className="text-(--outline) text-xs font-bold">{count}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-headline border-(--surface-container-highest) border-b pb-2 text-sm font-bold tracking-tight">
              Conditionnement
            </h3>
            <div className="flex flex-wrap gap-2">
              <button className="bg-(--surface-container-highest) text-(--on-surface) hover:bg-(--primary-fixed) rounded px-3 py-1.5 text-xs font-bold shadow-sm transition-colors">
                Sac 25kg
              </button>
              <button className="bg-primary text-(--on-primary) rounded px-3 py-1.5 text-xs font-bold shadow-sm">
                Sac 50kg
              </button>
              <button className="bg-(--surface-container-highest) text-(--on-surface) hover:bg-(--primary-fixed) rounded px-3 py-1.5 text-xs font-bold shadow-sm transition-colors">
                Carton
              </button>
              <button className="bg-(--surface-container-highest) text-(--on-surface) hover:bg-(--primary-fixed) rounded px-3 py-1.5 text-xs font-bold shadow-sm transition-colors">
                Palette
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-headline border-(--surface-container-highest) border-b pb-2 text-sm font-bold tracking-tight">
              Gamme de prix (DA)
            </h3>
            <div className="space-y-4">
              <input
                type="range"
                className="bg-(--surface-container-highest) accent-primary h-1.5 w-full cursor-pointer appearance-none rounded-lg"
              />
              <div className="flex items-center justify-between">
                <span className="bg-(--surface-container-low) rounded px-2 py-1 font-mono text-xs font-bold">
                  5 000 DA
                </span>
                <span className="bg-(--surface-container-low) rounded px-2 py-1 font-mono text-xs font-bold">
                  250 000 DA
                </span>
              </div>
            </div>
          </div>

          <div className="border-(--surface-container-highest) space-y-4 border-t pt-4">
            <label className="flex cursor-pointer items-center justify-between">
              <span className="text-sm font-medium text-(--on-surface)">En stock seulement</span>
              <span className="bg-(--primary-container) inline-flex h-5 w-9 items-center rounded-full">
                <span className="bg-(--on-primary) inline-block h-3 w-3 translate-x-5 rounded-full transition-transform" />
              </span>
            </label>
            <label className="flex cursor-pointer items-center justify-between">
              <span className="text-sm font-medium text-(--on-surface)">Algerie / Import</span>
              <span className="bg-(--surface-container-highest) inline-flex h-5 w-9 items-center rounded-full">
                <span className="inline-block h-3 w-3 translate-x-1 rounded-full bg-white transition-transform" />
              </span>
            </label>
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
              <div className="flex items-center gap-6">
                <div className="bg-(--surface-container-low) flex items-center gap-2 rounded-lg p-1">
                  <button className="bg-(--surface-container-lowest) text-primary rounded-md p-1.5 shadow-sm">
                    <span className="material-symbols-outlined text-sm">grid_view</span>
                  </button>
                  <button className="text-(--on-surface-variant) hover:bg-(--surface-container-highest) rounded-md p-1.5">
                    <span className="material-symbols-outlined text-sm">list</span>
                  </button>
                </div>
                <div className="relative">
                  <select className="bg-(--surface-container-lowest) focus:ring-primary appearance-none rounded-lg border-none py-2 pr-10 pl-4 text-sm font-bold shadow-sm outline-none focus:ring-2">
                    <option>Prix croissant</option>
                    <option>Prix decroissant</option>
                    <option>Plus recents</option>
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute top-2 right-3 text-sm">
                    expand_more
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <h1 className="font-headline text-primary text-3xl font-extrabold tracking-tight">
                {productsFound}{' '}
                <span className="text-(--on-surface-variant) text-lg font-normal">produits trouves</span>
              </h1>
              <div className="flex gap-2">
                {['Sac 50kg', 'Legumes'].map((filter) => (
                  <span
                    key={filter}
                    className="bg-(--primary-fixed) text-(--on-primary-fixed-variant) flex items-center gap-1.5 rounded px-3 py-1 text-xs font-bold"
                  >
                    {filter}
                    <span className="material-symbols-outlined cursor-pointer text-[14px]">close</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {productsQuery.isLoading ? (
              <p className="text-(--on-surface-variant) col-span-full text-center text-sm">
                Chargement du catalogue…
              </p>
            ) : productsQuery.isError ? (
              <p className="text-(--on-surface-variant) col-span-full text-center text-sm">
                Impossible de charger les produits. Vérifiez que l&apos;API est disponible
                {import.meta.env.DEV ? ' (VITE_API_URL ou http://localhost:8080 par défaut)' : ''}.
              </p>
            ) : cards.length === 0 ? (
              <p className="text-(--on-surface-variant) col-span-full text-center text-sm">
                Aucun produit pour le moment.
              </p>
            ) : (
              cards.map((product) => <ProductCard key={product.id} product={product} />)
            )}
          </div>

          <div className="flex items-center justify-center pt-12">
            <nav className="flex items-center gap-2">
              <button className="text-(--outline) hover:bg-(--surface-container-high) flex h-10 w-10 items-center justify-center rounded-lg transition-colors">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="bg-primary text-(--on-primary) h-10 w-10 rounded-lg text-sm font-bold">1</button>
              <button className="text-(--on-surface-variant) hover:bg-(--surface-container-high) h-10 w-10 rounded-lg text-sm font-bold">
                2
              </button>
              <button className="text-(--on-surface-variant) hover:bg-(--surface-container-high) h-10 w-10 rounded-lg text-sm font-bold">
                3
              </button>
              <span className="text-(--outline) px-2">...</span>
              <button className="text-(--on-surface-variant) hover:bg-(--surface-container-high) h-10 w-10 rounded-lg text-sm font-bold">
                12
              </button>
              <button className="text-(--on-surface) hover:bg-(--surface-container-high) flex h-10 w-10 items-center justify-center rounded-lg transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </nav>
          </div>
        </div>
      </section>
    </main>
  )
}
