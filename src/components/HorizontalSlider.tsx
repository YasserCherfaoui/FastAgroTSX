import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { cn } from '../lib/utils'

type HorizontalSliderProps = {
  children: ReactNode
  className?: string
  'aria-label': string
}

/**
 * Horizontally scrollable row with optional prev/next controls and scroll-snap.
 */
export default function HorizontalSlider({
  children,
  className,
  'aria-label': ariaLabel,
}: HorizontalSliderProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanPrev(scrollLeft > 4)
    setCanNext(scrollLeft < scrollWidth - clientWidth - 4)
  }, [])

  useLayoutEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    updateArrows()
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(updateArrows)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [updateArrows, children])

  const scrollByDir = (dir: -1 | 1) => {
    const el = scrollerRef.current
    if (!el) return
    const step = Math.max(200, el.clientWidth * 0.72)
    el.scrollBy({ left: step * dir, behavior: 'smooth' })
  }

  const navBtnClass =
    'absolute top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--outline)_30%,transparent)] bg-[var(--surface-container-lowest)] text-[var(--on-surface)] shadow-md transition hover:bg-[var(--surface-container-highest)] sm:h-11 sm:w-11'

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        className={cn(
          navBtnClass,
          'left-0',
          !canPrev && 'pointer-events-none opacity-0',
        )}
        aria-hidden={!canPrev}
        tabIndex={canPrev ? 0 : -1}
        aria-label="Faire défiler vers la gauche"
        onClick={() => scrollByDir(-1)}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        className={cn(
          navBtnClass,
          'right-0',
          !canNext && 'pointer-events-none opacity-0',
        )}
        aria-hidden={!canNext}
        tabIndex={canNext ? 0 : -1}
        aria-label="Faire défiler vers la droite"
        onClick={() => scrollByDir(1)}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <div
        ref={scrollerRef}
        role="region"
        aria-label={ariaLabel}
        onScroll={updateArrows}
        className={cn(
          'flex w-full flex-nowrap gap-4 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          'scroll-pl-1 scroll-pr-1 snap-x snap-mandatory',
          'pb-1',
        )}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') {
            e.preventDefault()
            scrollByDir(-1)
          } else if (e.key === 'ArrowRight') {
            e.preventDefault()
            scrollByDir(1)
          }
        }}
      >
        {children}
      </div>
    </div>
  )
}

export function HorizontalSliderItem({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return <div className={cn('min-w-0 shrink-0 snap-start', className)}>{children}</div>
}
