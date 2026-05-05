import { useEffect, useId, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useRouterState } from '@tanstack/react-router'

import { cn } from '../lib/utils'
import { useCart } from '../lib/cart'
import { fetchCatalogueMinimumOrder } from '../lib/api'

import AuthNavActions from './AuthNavActions'

export default function Header() {
  const { itemCount } = useCart()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [mobileOpen, setMobileOpen] = useState(false)
  const drawerTitleId = useId()
  const minimumOrderQuery = useQuery({
    queryKey: ['catalogue', 'settings', 'minimum-order'],
    queryFn: fetchCatalogueMinimumOrder,
  })
  const minimumOrderDa = Math.max(
    0,
    Math.round((minimumOrderQuery.data?.minimum_order_cents ?? 0) / 100),
  )

  const isCatalogue = pathname === '/catalogue'
  const isCart = pathname === '/cart' || pathname === '/checkout'
  const isMyAccount = pathname === '/my-account'

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [mobileOpen])

  const navLinkClass = (active: boolean) =>
    cn(
      'block rounded-lg px-3 py-3 text-base font-black tracking-tight no-underline transition-colors duration-200',
      active
        ? 'bg-(--surface-container-high) text-primary'
        : 'text-(--on-surface) hover:bg-(--surface-container-low) hover:text-primary',
    )

  return (
    <>
      <div className="bg-(--secondary-container) text-(--on-secondary-container) px-4 py-2 text-center text-[10px] font-bold tracking-[0.14em] uppercase sm:px-8 sm:text-xs">
        Livraison nationale | Min. commande: {minimumOrderDa.toLocaleString('fr-FR')} DA
      </div>
      <header className="sticky top-0 z-50 px-4 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.06)] backdrop-blur-xl">
        {/* Mobile: menu + logo + cart only */}
        <nav
          className="relative mx-auto flex w-full max-w-[1360px] items-center justify-between py-3 md:hidden"
          aria-label="Navigation principale"
        >
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="text-(--on-surface) hover:text-primary -m-2 inline-flex items-center justify-center rounded-lg p-2 transition-colors"
            aria-expanded={mobileOpen}
            aria-controls="site-mobile-drawer"
            aria-label="Ouvrir le menu"
          >
            <span className="material-symbols-outlined text-[28px]">menu</span>
          </button>

          <Link
            to="/"
            className="text-primary absolute left-1/2 inline-flex -translate-x-1/2 items-center gap-2 text-xl leading-none font-black tracking-tight no-underline"
          >
            <span className="text-2xl" aria-hidden="true">
              &#10047;
            </span>
            <span className="italic">Fast-Agros</span>
          </Link>

          <Link
            to="/cart"
            className={cn(
              'relative -m-2 inline-flex items-center justify-center rounded-lg p-2 no-underline transition-colors',
              isCart ? 'text-primary bg-(--surface-container-high)' : 'text-(--on-surface-variant) hover:bg-(--surface-container-low) hover:text-primary',
            )}
            aria-label={itemCount > 0 ? `Panier, ${itemCount} articles` : 'Panier'}
          >
            <span className="material-symbols-outlined text-[26px]">shopping_cart</span>
            {itemCount > 0 ? (
              <span className="bg-secondary text-(--on-secondary-container) absolute -top-0.5 -right-0.5 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] leading-none font-bold">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            ) : null}
          </Link>
        </nav>

        {/* Desktop */}
        <nav className="mx-auto hidden w-full max-w-[1360px] flex-wrap items-center gap-y-3 py-4 md:flex">
          <Link
            to="/"
            className="text-primary inline-flex items-center gap-2 text-2xl leading-none font-black tracking-tight no-underline"
          >
            <span className="text-3xl" aria-hidden="true">
              &#10047;
            </span>
            <span className="italic">Fast-Agros</span>
          </Link>

          <div className="order-3 mt-1 flex w-full flex-wrap items-center gap-6 md:order-2 md:mt-0 md:w-auto md:justify-center md:pl-12">
            <Link
              to="/catalogue"
              className={cn(
                'text-sm font-black tracking-tight no-underline transition-colors duration-200',
                isCatalogue
                  ? 'text-primary border-primary border-b-2 pb-1'
                  : 'text-(--on-surface-variant) hover:text-primary',
              )}
            >
              Catalogue
            </Link>
            <a
              href="/#categories"
              className="text-(--on-surface-variant) hover:text-primary text-sm font-black tracking-tight no-underline transition-colors duration-200"
            >
              Categories
            </a>
            <a
              href="/#gros"
              className="text-(--on-surface-variant) hover:text-primary text-sm font-black tracking-tight no-underline transition-colors duration-200"
            >
              Gros
            </a>
            <a
              href="/#contact"
              className="text-(--on-surface-variant) hover:text-primary text-sm font-black tracking-tight no-underline transition-colors duration-200"
            >
              Contact
            </a>
            <Link
              to="/my-account"
              className={cn(
                'text-sm font-black tracking-tight no-underline transition-colors duration-200',
                isMyAccount
                  ? 'text-primary border-primary border-b-2 pb-1'
                  : 'text-(--on-surface-variant) hover:text-primary',
              )}
            >
              Mon compte
            </Link>
          </div>

          <div className="ml-auto flex items-center gap-4 sm:gap-6">
            <Link
              to="/cart"
              className={cn(
                'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold no-underline transition-colors duration-200',
                isCart
                  ? 'bg-(--surface-container-high) text-primary'
                  : 'text-(--on-surface-variant) hover:bg-(--surface-container-low) hover:text-primary',
              )}
            >
              <span className="material-symbols-outlined text-base">shopping_cart</span>
              Panier
              {itemCount > 0 ? (
                <span className="bg-secondary text-(--on-secondary-container) inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] leading-none font-bold">
                  {itemCount}
                </span>
              ) : null}
            </Link>
            <AuthNavActions />
            <Link
              to="/checkout"
              className="bg-(--secondary-container) text-(--on-secondary-container) rounded-lg px-6 py-2.5 text-sm font-bold transition duration-200 hover:-translate-y-0.5"
            >
              Commander maintenant
            </Link>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <div
        className={cn(
          'fixed inset-0 z-100 md:hidden',
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          className={cn(
            'absolute inset-0 bg-black/40 transition-opacity duration-200',
            mobileOpen ? 'opacity-100' : 'opacity-0',
          )}
          onClick={() => setMobileOpen(false)}
          tabIndex={mobileOpen ? 0 : -1}
          aria-label="Fermer le menu"
        />
        <div
          id="site-mobile-drawer"
          role="dialog"
          aria-modal="true"
          aria-labelledby={drawerTitleId}
          className={cn(
            'bg-(--surface-container-lowest) absolute inset-y-0 left-0 flex w-[min(100%,20rem)] max-w-[85vw] flex-col shadow-[4px_0_24px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="border-(--outline-variant) flex items-center justify-between border-b px-4 py-4">
            <p id={drawerTitleId} className="font-headline m-0 text-lg font-black text-(--on-surface)">
              Menu
            </p>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="text-(--on-surface-variant) hover:text-primary -m-2 inline-flex rounded-lg p-2 transition-colors"
              aria-label="Fermer le menu"
            >
              <span className="material-symbols-outlined text-[26px]">close</span>
            </button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-4">
            <Link to="/catalogue" className={navLinkClass(isCatalogue)} onClick={() => setMobileOpen(false)}>
              Catalogue
            </Link>
            <a href="/#categories" className={navLinkClass(false)} onClick={() => setMobileOpen(false)}>
              Categories
            </a>
            <a href="/#gros" className={navLinkClass(false)} onClick={() => setMobileOpen(false)}>
              Gros
            </a>
            <a href="/#contact" className={navLinkClass(false)} onClick={() => setMobileOpen(false)}>
              Contact
            </a>
            <Link to="/my-account" className={navLinkClass(isMyAccount)} onClick={() => setMobileOpen(false)}>
              Mon compte
            </Link>

            <div className="border-(--outline-variant) mt-4 border-t pt-4">
              <AuthNavActions
                loggedInContainerClassName="flex flex-col items-stretch gap-2"
                loginClassName="text-primary block rounded-lg px-3 py-3 text-base font-bold no-underline hover:bg-(--surface-container-low)"
                nameClassName="text-(--on-surface) block truncate px-3 py-1 text-sm font-semibold"
                logoutClassName="text-(--on-surface-variant) hover:text-primary block w-full rounded-lg px-3 py-2 text-left text-sm font-bold transition"
              />
            </div>

            <div className="mt-auto pt-6">
              <Link
                to="/checkout"
                className="bg-(--secondary-container) text-(--on-secondary-container) block w-full rounded-lg py-3 text-center text-sm font-bold no-underline transition hover:opacity-95"
                onClick={() => setMobileOpen(false)}
              >
                Commander maintenant
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
