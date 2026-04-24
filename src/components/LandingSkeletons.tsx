import { cn } from '../lib/utils'

function ShimmerBox({ className }: { className?: string }) {
  return <div className={cn('landing-shimmer', className)} aria-hidden />
}

/** Shimmer that matches the main hero / carousel size and layout. */
export function CarouselSectionSkeleton() {
  return (
    <section
      className="w-full border-b border-[color-mix(in_oklab,var(--outline-variant)_50%,transparent)]"
      aria-busy="true"
      aria-label="Chargement du carrousel"
    >
      <span className="sr-only">Chargement du carrousel…</span>
      <div className="relative mx-auto w-full max-w-[1360px]">
        <div className="relative aspect-[16/8] min-h-[280px] w-full sm:min-h-[320px] md:aspect-[2.1/1] md:min-h-0">
          <ShimmerBox className="h-full w-full" />
          <div className="absolute bottom-8 left-6 z-10 max-w-2xl space-y-3 sm:bottom-10 sm:left-10 md:left-12">
            <ShimmerBox className="h-8 w-full max-w-md rounded-md sm:h-9" />
            <ShimmerBox className="h-4 w-full max-w-sm rounded-md" />
            <ShimmerBox className="h-10 w-36 rounded-lg sm:w-40" />
          </div>
        </div>
      </div>
    </section>
  )
}

function BrandsRowSkeleton() {
  const slots = 6
  return (
    <div
      className="flex w-full flex-nowrap gap-4 overflow-hidden px-1 sm:px-10"
      aria-hidden
    >
      {Array.from({ length: slots }, (_, i) => (
        <div
          key={i}
          className="w-[8.75rem] shrink-0 sm:w-40"
        >
          <ShimmerBox className="h-20 w-full rounded-xl sm:h-24" />
        </div>
      ))}
    </div>
  )
}

export function BrandsSectionSkeleton() {
  return (
    <div aria-busy="true">
      <span className="sr-only">Chargement des marques…</span>
      <BrandsRowSkeleton />
    </div>
  )
}

function CategoryCardSkeleton() {
  return (
    <div
      className="w-[min(20rem,85vw)] shrink-0 sm:w-96"
      aria-hidden
    >
      <div className="flex items-start gap-4 rounded-xl bg-(--surface-container-highest) p-6 sm:gap-5 sm:p-8">
        <ShimmerBox className="h-14 w-14 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1 space-y-3 pt-0.5">
          <ShimmerBox className="h-6 w-full max-w-[12rem] rounded-md" />
          <ShimmerBox className="h-4 w-full max-w-[9rem] rounded-md" />
        </div>
      </div>
    </div>
  )
}

function CategoriesRowSkeleton() {
  const slots = 4
  return (
    <div className="flex w-full flex-nowrap gap-4 overflow-hidden px-1 sm:px-10" aria-hidden>
      {Array.from({ length: slots }, (_, i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function CategoriesSectionSkeleton() {
  return (
    <div aria-busy="true">
      <span className="sr-only">Chargement des catégories…</span>
      <CategoriesRowSkeleton />
    </div>
  )
}
