import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { fetchCatalogueCategories, fetchCatalogueProducts } from '../lib/api'
import type { Category, Product } from '../models/product'
import { formatDa } from '../models/product'

export const Route = createFileRoute('/')({ component: App })

function formatCategoryProductSubtitle(count: number | undefined): string {
  const n = count ?? 0
  if (n === 0) return 'Aucun produit pour le moment'
  if (n === 1) return '1 Produit disponible'
  return `${n.toLocaleString('fr-FR')} Produits disponibles`
}

/** Circular avatar: icon SVG, else cover image, else initial. No background fill. */
function CategoryAvatar({ category }: { category: Category }) {
  const imageUrl = category.image_public_url?.trim()
  const iconSvg = category.icon_svg?.trim()

  const shellClass =
    'flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full text-[var(--primary)]'

  if (iconSvg) {
    return (
      <div
        className={`${shellClass} [&_svg]:h-9 [&_svg]:w-9 [&_svg]:max-h-full [&_svg]:max-w-full [&_svg]:shrink-0`}
        dangerouslySetInnerHTML={{ __html: iconSvg }}
        aria-hidden
      />
    )
  }

  if (imageUrl) {
    return (
      <div className={shellClass}>
        <img
          src={imageUrl}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
    )
  }

  return (
    <div
      className={`${shellClass} text-2xl font-black`}
      aria-hidden
    >
      {category.name.slice(0, 1).toUpperCase()}
    </div>
  )
}

const LANDING_PRODUCT_IMAGE_FALLBACK =
  'https://placehold.co/600x400/e8e8e0/1B5E20?text=Fast-Agros'

function daFromCents(cents: number): number {
  return Math.round(cents / 100)
}

function LandingBestSellerCard({ product: p }: { product: Product }) {
  const imageUrl = p.images?.[0]?.public_url ?? LANDING_PRODUCT_IMAGE_FALLBACK
  const sorted = [...(p.pricing_tiers ?? [])].sort((a, b) => a.sort_order - b.sort_order)
  const primary = sorted.find((t) => t.is_highlighted) ?? sorted[0]
  const secondary =
    primary != null ? sorted.find((t) => t.id !== primary.id) : undefined
  const mainLabel = primary?.label ?? 'Prix'
  const mainDa = daFromCents(primary?.price_cents ?? p.price_cents)

  return (
    <article className="rounded-2xl bg-[var(--surface-container-lowest)] p-6 shadow-[0_10px_18px_rgba(26,28,25,0.08)]">
      <img
        src={imageUrl}
        alt={p.name}
        className="h-48 w-full rounded-xl object-cover"
      />
      <p className="mt-5 mb-1 text-xs font-bold tracking-[0.12em] text-[var(--on-surface-variant)] uppercase">
        {p.category?.name ?? 'Catalogue'}
      </p>
      <Link
        to="/products/$productId"
        params={{ productId: String(p.id) }}
        className="text-inherit no-underline"
      >
        <h3 className="m-0 text-xl font-black text-[var(--on-surface)] transition-colors hover:text-[var(--primary)]">
          {p.name}
        </h3>
      </Link>
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between rounded-lg bg-[var(--surface-container-low)] px-3 py-3">
          <span className="text-xs text-[var(--on-surface-variant)]">{mainLabel}</span>
          <span className="text-lg font-black text-[var(--primary)]">{formatDa(mainDa)}</span>
        </div>
        {secondary ? (
          <div className="flex items-center justify-between px-3 text-xs text-[var(--on-surface-variant)]">
            <span>{secondary.label}</span>
            <span className="font-bold text-[var(--on-surface)]">
              {formatDa(daFromCents(secondary.price_cents))}
            </span>
          </div>
        ) : null}
      </div>
      <Link
        to="/products/$productId"
        params={{ productId: String(p.id) }}
        className="mt-6 block w-full rounded-lg bg-[linear-gradient(120deg,var(--primary),var(--primary-container))] py-3 text-center text-sm font-bold text-[var(--on-primary)] no-underline"
      >
        Voir le produit
      </Link>
    </article>
  )
}

function App() {
  const categoriesQuery = useQuery({
    queryKey: ['catalogue', 'categories', { page: 1, perPage: 100 }],
    queryFn: () => fetchCatalogueCategories({ page: 1, perPage: 100 }),
  })

  const bestSellersQuery = useQuery({
    queryKey: ['catalogue', 'products', 'best-sellers'],
    queryFn: () =>
      fetchCatalogueProducts({ page: 1, perPage: 8, bestSeller: true }),
  })

  const categories =
    categoriesQuery.data?.items.filter((c) => c.is_active) ?? []

  const logisticsSteps = [
    'Créez votre Compte',
    'Remplissez votre Panier',
    'Validation & Facturation',
    'Livraison sous 48h',
  ]

  return (
    <main className="overflow-hidden">
      <section className="relative mx-auto grid min-h-[760px] w-full max-w-[1360px] items-center gap-14 px-6 py-16 lg:grid-cols-2 lg:px-8">
        <div className="space-y-8">
          <span className="inline-flex rounded-md bg-[color:color-mix(in_oklab,var(--primary-container)_12%,transparent)] px-4 py-1.5 text-xs font-bold tracking-[0.18em] text-[var(--primary)] uppercase">
            Grossiste & Détaillant
          </span>
          <h1 className="max-w-3xl text-5xl leading-[1.08] font-black tracking-[-0.03em] text-[var(--on-background)] md:text-7xl">
            Approvisionnez votre commerce{' '}
            <span className="text-[var(--primary)]">avec excellence.</span>
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-[var(--on-surface-variant)]">
            Directement du producteur à votre entrepôt. Profitez de tarifs
            industriels sur une gamme complète de produits agroalimentaires
            frais et secs.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="#catalogue"
              className="rounded-lg bg-[var(--secondary-container)] px-8 py-4 text-base font-extrabold text-[var(--on-secondary-container)] no-underline transition duration-200 hover:-translate-y-0.5"
            >
              Voir le Catalogue
            </a>
            <button
              type="button"
              className="rounded-lg bg-[var(--surface-container-lowest)] px-8 py-4 text-base font-extrabold text-[var(--primary)] transition duration-200 hover:bg-[var(--surface-container-highest)]"
            >
              Demander un Devis
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-8 pt-4 text-xs font-bold tracking-[0.14em] text-[var(--on-surface-variant)] uppercase">
            <span>ISO 22000</span>
            <span>Qualité Supérieure</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-[color:color-mix(in_oklab,var(--primary-container)_10%,transparent)]" />
          <div className="hero-image h-[600px] rounded-[2rem]">
            <img
              alt="Bulk food products warehouse"
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjF0u4NLdSZ77RRVD2_CIANPyFT4u2OlLkkp2eNrDWTWOMV-gHeS7LOrjapRhJFAQ3Smou5sH0jIII9fzCWOHHHxFHBtHMiv8LiDmwicd_odiRcBIm8FNwQ08rgk7K_G0RLar9hMWNNiT9qAWUBBDnyEyZfo0A8BIkUOGYIKcvx-zJxvCwBRBQX-Ayxj6XN0c-i4t3L_ePG4orUp5PwWVsREVIXLkhQkFvYgoHC-qMTyHIkVbnDFA9mev4pjziuv5KldmKFcLx5Aw"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 max-w-xs rounded-2xl bg-[var(--surface-container-lowest)] p-6 shadow-[0_20px_32px_rgba(26,28,25,0.12)]">
            <p className="m-0 text-3xl font-black text-[var(--primary)]">98%</p>
            <p className="m-0 mt-2 text-xs font-semibold tracking-[0.08em] text-[var(--on-surface-variant)] uppercase">
              Taux de satisfaction logistique
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[var(--primary-container)] py-16 text-[var(--on-primary)]">
        <div className="mx-auto grid w-full max-w-[1360px] grid-cols-2 gap-10 px-6 md:grid-cols-4 md:px-8">
          {[
            ['500+', 'Produits'],
            ['15', 'Wilayas'],
            ['2000+', 'Clients'],
            ['2010', 'Depuis'],
          ].map(([value, label]) => (
            <div key={label} className="pl-6">
              <p className="m-0 text-5xl leading-none font-black tracking-[-0.03em] text-[var(--primary-fixed)]">
                {value}
              </p>
              <p className="m-0 mt-3 text-xs font-medium tracking-[0.16em] text-[color:color-mix(in_oklab,var(--on-primary)_80%,transparent)] uppercase">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="categories" className="bg-[var(--surface-container-low)] px-6 py-24 sm:px-8">
        <div className="mx-auto w-full max-w-[1360px]">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2 className="m-0 text-4xl font-black tracking-tight text-[var(--on-surface)] uppercase">
                Nos Catégories
              </h2>
              <p className="m-0 mt-4 max-w-md text-[var(--on-surface-variant)]">
                Découvrez notre sélection rigoureuse de produits industriels
                pour professionnels.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categoriesQuery.isLoading && (
              <p className="col-span-full text-[var(--on-surface-variant)]">
                Chargement des catégories…
              </p>
            )}
            {categoriesQuery.isError && (
              <p className="col-span-full text-[var(--on-surface-variant)]">
                Impossible de charger les catégories pour le moment.
              </p>
            )}
            {!categoriesQuery.isLoading &&
              !categoriesQuery.isError &&
              categories.length === 0 && (
                <p className="col-span-full text-[var(--on-surface-variant)]">
                  Aucune catégorie disponible.
                </p>
              )}
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to="/catalogue"
                className="group block rounded-xl bg-[var(--surface-container-lowest)] p-8 no-underline transition duration-200 hover:bg-[var(--primary)] hover:text-[var(--on-primary)]"
              >
                <article className="flex items-start gap-5">
                  <CategoryAvatar category={cat} />
                  <div className="min-w-0 flex-1">
                    <p className="m-0 text-xl font-black text-[var(--on-surface)] group-hover:text-[var(--on-primary)]">
                      {cat.name}
                    </p>
                    <p className="m-0 mt-3 text-sm text-[var(--on-surface-variant)] group-hover:text-[color:color-mix(in_oklab,var(--on-primary)_78%,transparent)]">
                      {formatCategoryProductSubtitle(cat.product_count)}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="catalogue" className="px-6 py-24 sm:px-8">
        <div className="mx-auto w-full max-w-[1360px]">
          <h2 className="mb-16 text-center text-4xl font-black tracking-tight text-[var(--on-surface)] uppercase">
            Produits les plus commandés
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {bestSellersQuery.isLoading && (
              <p className="col-span-full text-center text-[var(--on-surface-variant)]">
                Chargement…
              </p>
            )}
            {bestSellersQuery.isError && (
              <p className="col-span-full text-center text-[var(--on-surface-variant)]">
                Impossible de charger les produits pour le moment.
              </p>
            )}
            {!bestSellersQuery.isLoading &&
              !bestSellersQuery.isError &&
              (bestSellersQuery.data?.items.length ?? 0) === 0 && (
                <p className="col-span-full text-center text-[var(--on-surface-variant)]">
                  Aucun best-seller configuré pour le moment.
                </p>
              )}
            {(bestSellersQuery.data?.items ?? []).map((p) => (
              <LandingBestSellerCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section id="gros" className="bg-[var(--surface-container-high)] px-6 py-24 sm:px-8">
        <div className="mx-auto w-full max-w-[1360px]">
          <h2 className="mb-16 text-center text-4xl font-black tracking-tight text-[var(--on-surface)] uppercase">
            Comment ça marche
          </h2>
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            {logisticsSteps.map((step, idx) => (
              <article key={step} className="text-center">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-md bg-[var(--primary)] text-3xl font-black text-[var(--on-primary)]">
                  {idx + 1}
                </div>
                <h3 className="m-0 text-xl font-bold text-[var(--on-surface)]">
                  {step}
                </h3>
                <p className="m-0 mt-3 text-sm leading-relaxed text-[var(--on-surface-variant)]">
                  Processus rapide, industriel et transparent pour sécuriser vos
                  flux d&apos;approvisionnement.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 sm:px-8">
        <div className="mx-auto flex w-full max-w-[1360px] flex-col items-center justify-between gap-10 rounded-[2rem] bg-[var(--primary-container)] p-12 lg:flex-row lg:p-16">
          <div className="max-w-xl text-[var(--on-primary)]">
            <h2 className="m-0 text-4xl leading-tight font-black">
              Recevez nos offres grossiste
            </h2>
            <p className="m-0 mt-5 text-lg text-[color:color-mix(in_oklab,var(--on-primary)_82%,transparent)]">
              Soyez informés en priorité de nos nouveaux arrivages et de nos
              baisses de prix industriels.
            </p>
          </div>
          <form className="flex w-full max-w-md gap-2 rounded-xl bg-[color:color-mix(in_oklab,var(--surface-container-lowest)_16%,transparent)] p-2">
            <input
              type="email"
              placeholder="Votre email professionnel"
              className="h-11 w-full rounded-lg border-none bg-transparent px-4 text-[var(--on-primary)] outline-none placeholder:text-[color:color-mix(in_oklab,var(--on-primary)_62%,transparent)]"
            />
            <button
              type="submit"
              className="rounded-lg bg-[var(--secondary-container)] px-6 py-3 text-sm font-bold whitespace-nowrap text-[var(--on-secondary-container)]"
            >
              S&apos;abonner
            </button>
          </form>
        </div>
      </section>

      <section className="px-6 pb-24 sm:px-8">
        <div className="mx-auto grid w-full max-w-[1360px] gap-8 lg:grid-cols-3">
          {[
            [
              "Fast-Agros a transformé notre chaîne d'approvisionnement. Leur ponctualité et la qualité constante des céréales sont exemplaires.",
              'Amine Mansouri',
              'Gérant Supermarché, Alger',
            ],
            [
              "En tant qu'industriel, nous exigeons des volumes importants et réguliers. Fast-Agros est le seul partenaire capable de suivre notre cadence.",
              'Sarah Benali',
              'Directrice Logistique, Oran',
            ],
            [
              "Le processus de commande en ligne est d'une efficacité redoutable. Fini les appels interminables pour connaître les stocks.",
              'Karim Zeggai',
              'Acheteur, Constantine',
            ],
          ].map(([quote, author, role]) => (
            <article
              key={author}
              className="rounded-3xl bg-[var(--surface-container-low)] p-10"
            >
              <p className="m-0 text-lg leading-relaxed font-medium text-[var(--on-surface)]">
                &ldquo;{quote}&rdquo;
              </p>
              <p className="m-0 mt-7 text-sm font-bold">{author}</p>
              <p className="m-0 mt-1 text-xs text-[var(--on-surface-variant)]">
                {role}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
