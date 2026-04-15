import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const categories = [
    ['Céréales', '45 Produits disponibles'],
    ['Huiles', '22 Produits disponibles'],
    ['Légumineuses', '38 Produits disponibles'],
    ['Conserves', '67 Produits disponibles'],
    ['Épices', '112 Produits disponibles'],
    ['Sucre', '14 Produits disponibles'],
    ['Produits Laitiers', '52 Produits disponibles'],
    ['Boissons', '89 Produits disponibles'],
  ]

  const topProducts = [
    [
      'Céréales',
      'Riz Basmati Premium (25kg)',
      '1 Palette',
      '45 000 DA',
      '42 500 DA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBPM4t0JyTLTt9TtJRYt0MB78vYHg_HWd8rsUj-sGlA3hQoZ9leCxJ0GoN1xsjBeAkgC_-S-QDxAcle50tLpiW4auOyHXT3yjdyJk3-0qgVHdmtvuPLlkwf9MNajrTYykYRIBW2I2vWb-jFXQHt1pYS_K4tILzKs6UE1UITPY3QYFQzDDaAL5mlU9Ffg7UVVYblh5OjZE0nvKaPhkPWX1O42YLJ-j2phhHsvu99T6f9mVqDxTY2wlct2NseeC6IiL7uFagZJV_NhOw',
    ],
    [
      'Huiles',
      'Huile de Tournesol (5L x 4)',
      'Carton',
      '5 200 DA',
      '4 850 DA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAg26QSPEBH-F_YwcDYVSTMCl_txiRlxV9M4rQrHQP7RCVcDheGDi6856zs9QpIPiODUKSTKgFxExrjOEiYkaz6xJPDxxiQyHM9biF9_E3z6aBPl4kRo2uM866jh2IdTOC68831bkD8RUqGeZP0elYTta_IZA63VO44SYiRMK91oD_zu9K9fEmrzBJNtJj9ryhaQ31Eq53eTlt8R2A-jArqije95h6vvf4ruptUHsstAgNO6C0U56pEEj-LONNH-3umLqzsMzX4qk4',
    ],
    [
      'Légumineuses',
      'Lentilles Brunes Extra (50kg)',
      '1 Sac',
      '12 400 DA',
      '11 900 DA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDhTdQSXIEu7oKiNOT2XRR_ESm08AAVPY73axGrsu0Y5_BNUp65VMT_y1xLCxEg1MmP8j4UYchIDfDXxzhPHgGCONamU-f2WsE1V7Py3eR9K776fWStnkKu7H8kWL1XXK9ejgmtag5qkDLF7j9aMRLbt3OaQSwsVNb-39FHadvVqc0pmf6ctYQVL5uPaTnwrQMFpYrF_5zIy-jefeRRfEQldg7jkFOwcicm0GWQ3_AraHuN0qqF38BBJFiVAvu-mm3eoTwmTkg6Sls',
    ],
    [
      'Sucre',
      'Sucre Raffiné Blanc (10kg x 5)',
      'Lot de 5',
      '6 100 DA',
      '5 750 DA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCsfyxE9UWZxHBl83ctYJdi5uMNI1p7HKKRHxzjJ0ujtOFZMS5dd5PZ82yHBRV3WpURQBgr3K9f_DgI8y10yDQiH_efOLl2MeOX7DdelE6ELMSsEkmiERbXCljY0PK2zAflI3DFDos8Edmx8w3fYfaFUsNGMX7AoaPFaTOLTv4m10H23nZQN2FbUXaEGYNCHZQnCUzWfQE0VIJYd6hR7JF0ziAHJkJ_WlRzEFtoG8AxaOdtFKu-nX9ocnH9OEDZR2333YtoQb5M944',
    ],
  ]

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
            {categories.map(([title, subtitle]) => (
              <article
                key={title}
                className="rounded-xl bg-[var(--surface-container-lowest)] p-8 transition duration-200 hover:bg-[var(--primary)] hover:text-[var(--on-primary)]"
              >
                <p className="m-0 text-xl font-black">{title}</p>
                <p className="m-0 mt-3 text-sm text-[var(--on-surface-variant)]">
                  {subtitle}
                </p>
              </article>
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
            {topProducts.map(
              ([category, name, unit, price, bulkPrice, image], index) => (
              <article
                key={name}
                className="rounded-2xl bg-[var(--surface-container-lowest)] p-6 shadow-[0_10px_18px_rgba(26,28,25,0.08)]"
              >
                <img
                  src={image}
                  alt={name}
                  className="h-48 w-full rounded-xl object-cover"
                />
                <p className="mt-5 mb-1 text-xs font-bold tracking-[0.12em] text-[var(--on-surface-variant)] uppercase">
                  {category}
                </p>
                <h3 className="m-0 text-xl font-black text-[var(--on-surface)]">
                  {name}
                </h3>
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-[var(--surface-container-low)] px-3 py-3">
                    <span className="text-xs text-[var(--on-surface-variant)]">
                      {unit}
                    </span>
                    <span className="text-lg font-black text-[var(--primary)]">
                      {price}
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-3 text-xs text-[var(--on-surface-variant)]">
                    <span>{index === 0 ? 'Min. 5 Palettes' : 'Volume grossiste'}</span>
                    <span className="font-bold text-[var(--on-surface)]">
                      {bulkPrice}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-6 w-full rounded-lg bg-[linear-gradient(120deg,var(--primary),var(--primary-container))] py-3 text-sm font-bold text-[var(--on-primary)]"
                >
                  Commander
                </button>
              </article>
              ),
            )}
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
