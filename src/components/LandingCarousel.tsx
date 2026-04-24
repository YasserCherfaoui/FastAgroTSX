import { Link } from '@tanstack/react-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { CatalogueCarousel } from '../models/catalogue-landing'

const AUTO_MS = 5000

const HERO_IMAGE_FALLBACK =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBjF0u4NLdSZ77RRVD2_CIANPyFT4u2OlLkkp2eNrDWTWOMV-gHeS7LOrjapRhJFAQ3Smou5sH0jIII9fzCWOHHHxFHBtHMiv8LiDmwicd_odiRcBIm8FNwQ08rgk7K_G0RLar9hMWNNiT9qAWUBBDnyEyZfo0A8BIkUOGYIKcvx-zJxvCwBRBQX-Ayxj6XN0c-i4t3L_ePG4orUp5PwWVsREVIXLkhQkFvYgoHC-qMTyHIkVbnDFA9mev4pjziuv5KldmKFcLx5Aw'

function isAppPath(url: string): boolean {
  const t = url.trim()
  return t.startsWith('/') && !t.startsWith('//')
}

function CtaButton({
  ctaText,
  ctaUrl,
}: {
  ctaText: string
  ctaUrl: string
}) {
  const className =
    'inline-flex items-center justify-center rounded-lg bg-[var(--secondary-container)] px-8 py-3.5 text-sm font-extrabold text-[var(--on-secondary-container)] no-underline transition duration-200 hover:-translate-y-0.5'
  if (isAppPath(ctaUrl)) {
    return (
      <Link to={ctaUrl} className={className}>
        {ctaText}
      </Link>
    )
  }
  return (
    <a
      href={ctaUrl}
      className={className}
      target="_blank"
      rel="noreferrer"
    >
      {ctaText}
    </a>
  )
}

function FallbackHero() {
  return (
    <section
      className="relative overflow-hidden border-b border-[color:color-mix(in_oklab,var(--outline-variant)_40%,transparent)] bg-[var(--surface-container-low)]"
      aria-label="Bienvenue"
    >
      <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-10 px-6 py-16 sm:px-8 lg:flex-row lg:items-center lg:py-20">
        <div className="min-w-0 flex-1 space-y-6">
          <span className="inline-flex rounded-md bg-[color:color-mix(in_oklab,var(--primary-container)_12%,transparent)] px-4 py-1.5 text-xs font-bold tracking-[0.18em] text-[var(--primary)] uppercase">
            Grossiste & Détaillant
          </span>
          <h1 className="m-0 max-w-3xl text-4xl leading-[1.1] font-black tracking-[-0.03em] text-[var(--on-background)] sm:text-5xl md:text-6xl">
            Approvisionnez votre commerce{' '}
            <span className="text-[var(--primary)]">avec excellence.</span>
          </h1>
          <p className="m-0 max-w-xl text-base leading-relaxed text-[var(--on-surface-variant)] sm:text-lg">
            Directement du producteur à votre entrepôt. Profitez de tarifs
            industriels sur une gamme complète de produits agroalimentaires
            frais et secs.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/catalogue"
              className="rounded-lg bg-[var(--secondary-container)] px-8 py-3.5 text-sm font-extrabold text-[var(--on-secondary-container)] no-underline transition duration-200 hover:-translate-y-0.5"
            >
              Voir le Catalogue
            </Link>
            <a
              href="#categories"
              className="rounded-lg border border-[color:color-mix(in_oklab,var(--outline)_35%,transparent)] bg-[var(--surface-container-lowest)] px-8 py-3.5 text-sm font-extrabold text-[var(--primary)] no-underline transition duration-200 hover:bg-[var(--surface-container-highest)]"
            >
              Nos catégories
            </a>
          </div>
        </div>
        <div className="relative min-w-0 flex-1">
          <div className="absolute -inset-2 -z-10 rounded-3xl bg-[color:color-mix(in_oklab,var(--primary-container)_10%,transparent)]" />
          <div className="aspect-[4/3] w-full max-h-[400px] overflow-hidden rounded-3xl sm:max-h-[440px]">
            <img
              alt=""
              src={HERO_IMAGE_FALLBACK}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default function LandingCarousel({ items }: { items: CatalogueCarousel[] }) {
  const n = items.length
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const indexRef = useRef(0)
  useEffect(() => {
    indexRef.current = index
  }, [index])

  const go = useCallback(
    (dir: -1 | 1) => {
      if (n === 0) return
      setIndex((i) => (i + dir + n) % n)
    },
    [n],
  )

  useEffect(() => {
    if (n < 2 || paused) return
    const id = window.setInterval(() => {
      go(1)
    }, AUTO_MS)
    return () => window.clearInterval(id)
  }, [n, paused, go])

  useEffect(() => {
    if (n > 0 && index >= n) {
      setIndex(0)
    }
  }, [n, index])

  if (n === 0) {
    return <FallbackHero />
  }

  const slide = items[index]!
  const title = slide.title?.trim()
  const subtitle = slide.subtitle?.trim()
  const ctaText = slide.cta_text?.trim()
  const ctaUrl = slide.cta_url?.trim()

  return (
    <section
      className="relative w-full border-b border-[color:color-mix(in_oklab,var(--outline-variant)_50%,transparent)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carrousel"
    >
      <div className="relative mx-auto w-full max-w-[1360px]">
        <div className="relative aspect-[16/8] min-h-[280px] w-full sm:min-h-[320px] md:aspect-[2.1/1] md:min-h-0">
          {items.map((s, i) => {
            const src = s.image_public_url?.trim() || HERO_IMAGE_FALLBACK
            const isActive = i === index
            return (
              <div
                key={s.id}
                className={`absolute inset-0 transition-opacity duration-500 ${isActive ? 'z-[1] opacity-100' : 'z-0 opacity-0'}`}
                aria-hidden={!isActive}
              >
                <img
                  src={src}
                  alt={s.title?.trim() || 'Bannière'}
                  className="h-full w-full object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[color:rgba(0,0,0,0.7)] via-[color:rgba(0,0,0,0.2)] to-transparent"
                  aria-hidden
                />
              </div>
            )
          })}

          <div className="absolute inset-0 z-[2] flex flex-col justify-end px-6 py-8 sm:px-10 sm:py-10 md:px-12">
            <div className="max-w-2xl text-white">
              {title ? (
                <h1 className="m-0 text-3xl font-black tracking-tight drop-shadow-sm sm:text-4xl md:text-5xl">
                  {title}
                </h1>
              ) : null}
              {subtitle ? (
                <p
                  className={`m-0 text-base leading-relaxed text-white/90 sm:text-lg ${title ? 'mt-3' : ''}`}
                >
                  {subtitle}
                </p>
              ) : null}
              {ctaText && ctaUrl ? (
                <div className="mt-6">
                  <CtaButton ctaText={ctaText} ctaUrl={ctaUrl} />
                </div>
              ) : null}
            </div>
          </div>

          {n > 1 ? (
            <>
              <button
                type="button"
                className="absolute top-1/2 left-2 z-[3] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[color:rgba(0,0,0,0.35)] text-white backdrop-blur-sm transition hover:bg-[color:rgba(0,0,0,0.5)]"
                onClick={() => go(-1)}
                aria-label="Diapositive précédente"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                className="absolute top-1/2 right-2 z-[3] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[color:rgba(0,0,0,0.35)] text-white backdrop-blur-sm transition hover:bg-[color:rgba(0,0,0,0.5)]"
                onClick={() => go(1)}
                aria-label="Diapositive suivante"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          ) : null}
        </div>

        {n > 1 ? (
          <div
            className="absolute bottom-4 left-1/2 z-[3] flex -translate-x-1/2 gap-2"
            role="tablist"
            aria-label="Choisir une diapositive"
          >
            {items.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  i === index
                    ? 'w-6 bg-white'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                onClick={() => setIndex(i)}
                aria-label={`Diapositive ${i + 1} sur ${n}`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
