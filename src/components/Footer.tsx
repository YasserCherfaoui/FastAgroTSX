export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer id="contact" className="mt-30 bg-[var(--surface-container)] px-6 py-16 text-[var(--on-surface)] sm:px-8">
      <div className="mx-auto grid w-full max-w-[1360px] gap-12 md:grid-cols-4">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 text-2xl font-extrabold text-[var(--primary)]">
            <span aria-hidden="true">&#10047;</span> Fast-Agros
          </p>
          <p className="m-0 max-w-xs text-sm leading-relaxed text-[var(--on-surface-variant)]">
            Industrial Freshness. Votre partenaire logistique de confiance pour
            l&apos;agroalimentaire en gros.
          </p>
        </div>

        <div>
          <h4 className="mb-6 text-xs font-bold tracking-[0.2em] text-[var(--primary)] uppercase">
            Navigation
          </h4>
          <ul className="m-0 list-none space-y-3 p-0 text-xs font-medium tracking-[0.1em] text-[var(--on-surface-variant)] uppercase">
            <li>Catalogue</li>
            <li>Catégories</li>
            <li>Vente en Gros</li>
            <li>Devenir Partenaire</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-6 text-xs font-bold tracking-[0.2em] text-[var(--primary)] uppercase">
            Légal
          </h4>
          <ul className="m-0 list-none space-y-3 p-0 text-xs font-medium tracking-[0.1em] text-[var(--on-surface-variant)] uppercase">
            <li>CGV</li>
            <li>Mentions Légales</li>
            <li>Confidentialité</li>
            <li>Politique Cookies</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-6 text-xs font-bold tracking-[0.2em] text-[var(--primary)] uppercase">
            Contact
          </h4>
          <ul className="m-0 list-none space-y-3 p-0 text-xs font-medium tracking-[0.1em] text-[var(--on-surface-variant)] uppercase">
            <li>Alger, Algérie</li>
            <li>contact@fast-agros.dz</li>
            <li className="font-bold text-[var(--on-surface)]">
              +213 (0) 550 00 00 00
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex w-full max-w-[1360px] flex-col items-center justify-between gap-4 border-t border-[color:color-mix(in_oklab,var(--outline-variant)_15%,transparent)] pt-6 text-[10px] tracking-[0.14em] text-[var(--on-surface-variant)] uppercase md:flex-row">
        <p className="m-0">&copy; {year} Fast-Agros. Industrial Freshness.</p>
        <p className="m-0">Paiement sécurisé | Livraison 48h</p>
      </div>
    </footer>
  )
}
