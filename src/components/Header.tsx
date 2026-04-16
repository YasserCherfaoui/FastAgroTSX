import { Link, useRouterState } from '@tanstack/react-router'

import { cn } from '../lib/utils'
import { useCart } from '../lib/cart'

import AuthNavActions from './AuthNavActions'

export default function Header() {
  const { itemCount } = useCart()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isCatalogue = pathname === '/catalogue'
  const isCart = pathname === '/cart' || pathname === '/checkout'

  return (
    <>
      <div className="bg-(--secondary-container) text-(--on-secondary-container) px-6 py-2 text-center text-xs font-bold tracking-[0.14em] uppercase sm:px-8">
        Livraison nationale | Min. commande: 50 000 DA
      </div>
      <header className="sticky top-0 z-50 px-4 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.06)] backdrop-blur-xl">
        <nav className="mx-auto flex w-full max-w-[1360px] flex-wrap items-center gap-y-3 py-4">
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
    </>
  )
}
