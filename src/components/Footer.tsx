import { Link } from '@tanstack/react-router'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer id="contact" className="bg-(--surface-container) text-(--on-surface) mt-30 px-6 py-16 sm:px-8">
      <div className="mx-auto grid w-full max-w-[1360px] gap-12 md:grid-cols-4">
        <div>
          <p className="text-primary mb-5 inline-flex items-center gap-2 text-2xl font-extrabold">
            <span aria-hidden="true">&#10047;</span> Fast-Agros
          </p>
          <p className="text-(--on-surface-variant) m-0 max-w-xs text-sm leading-relaxed">
            Industrial Freshness. Votre partenaire logistique de confiance pour
            l&apos;agroalimentaire en gros.
          </p>
        </div>

        <div>
          <h4 className="text-primary mb-6 text-xs font-bold tracking-[0.2em] uppercase">
            Navigation
          </h4>
          <ul className="text-(--on-surface-variant) m-0 list-none space-y-3 p-0 text-xs font-medium tracking-widest uppercase">
            <li>
              <Link to="/catalogue" className="text-inherit no-underline hover:text-primary">
                Catalogue
              </Link>
            </li>
            <li>
              <a href="/#categories" className="text-inherit no-underline hover:text-primary">
                Catégories
              </a>
            </li>
            <li>
              <Link to="/cart" className="text-inherit no-underline hover:text-primary">
                Panier
              </Link>
            </li>
            <li>
              <Link to="/checkout" className="text-inherit no-underline hover:text-primary">
                Checkout
              </Link>
            </li>
            <li>
              <a href="/#gros" className="text-inherit no-underline hover:text-primary">
                Vente en Gros
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-primary mb-6 text-xs font-bold tracking-[0.2em] uppercase">
            Légal
          </h4>
          <ul className="text-(--on-surface-variant) m-0 list-none space-y-3 p-0 text-xs font-medium tracking-widest uppercase">
            <li>CGV</li>
            <li>Mentions Légales</li>
            <li>Confidentialité</li>
            <li>Politique Cookies</li>
          </ul>
        </div>

        <div>
          <h4 className="text-primary mb-6 text-xs font-bold tracking-[0.2em] uppercase">
            Contact
          </h4>
          <ul className="text-(--on-surface-variant) m-0 list-none space-y-3 p-0 text-xs font-medium tracking-widest uppercase">
            <li>Alger, Algérie</li>
            <li>contact@fast-agros.dz</li>
            <li className="text-(--on-surface) font-bold">
              +213 (0) 550 00 00 00
            </li>
          </ul>
        </div>
      </div>

      <div className="border-[color-mix(in_oklab,var(--outline-variant)_15%,transparent)] text-(--on-surface-variant) mx-auto mt-12 flex w-full max-w-[1360px] flex-col items-center justify-between gap-4 border-t pt-6 text-[10px] tracking-[0.14em] uppercase md:flex-row">
        <p className="m-0">&copy; {year} Fast-Agros. Industrial Freshness.</p>
        <p className="m-0">Paiement sécurisé | Livraison 48h</p>
      </div>
    </footer>
  )
}
