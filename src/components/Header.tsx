import { Link } from '@tanstack/react-router'

export default function Header() {
  const navItems = ['Catalogue', 'Categories', 'Gros', 'Contact']

  return (
    <>
      <div className="bg-[var(--secondary-container)] px-6 py-2 text-center text-xs font-bold tracking-[0.14em] text-[var(--on-secondary-container)] uppercase sm:px-8">
        Livraison nationale | Min. commande: 50 000 DA
      </div>
      <header className="sticky top-0 z-50 px-4 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.06)] backdrop-blur-xl">
        <nav className="mx-auto flex w-full max-w-[1360px] flex-wrap items-center gap-y-3 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-2xl leading-none font-black tracking-tight text-[var(--primary)] no-underline"
          >
            <span className="text-3xl" aria-hidden="true">
              &#10047;
            </span>
            <span className="italic">Fast-Agros</span>
          </Link>

          <div className="order-3 mt-1 flex w-full flex-wrap items-center gap-6 md:order-2 md:mt-0 md:w-auto md:justify-center md:pl-12">
            {navItems.map((item, index) => (
              <a
                key={item}
                href={index === 0 ? '#catalogue' : index === 1 ? '#categories' : index === 2 ? '#gros' : '#contact'}
                className={`text-sm font-black tracking-tight no-underline transition-colors duration-200 ${
                  index === 0
                    ? 'border-b-2 border-[var(--primary)] pb-1 text-[var(--primary)]'
                    : 'text-[var(--on-surface-variant)] hover:text-[var(--primary)]'
                }`}
              >
                {item}
              </a>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-4 sm:gap-6">
            <button
              type="button"
              className="text-sm font-bold text-[var(--primary)] transition hover:underline"
            >
              Se connecter
            </button>
            <button
              type="button"
              className="rounded-lg bg-[var(--secondary-container)] px-6 py-2.5 text-sm font-bold text-[var(--on-secondary-container)] transition duration-200 hover:-translate-y-0.5"
            >
              Commander maintenant
            </button>
          </div>
        </nav>
      </header>
    </>
  )
}
