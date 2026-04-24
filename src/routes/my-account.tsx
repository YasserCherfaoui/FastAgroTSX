import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'

import { fetchMyOrders } from '../lib/api'
import { requireAuthentication } from '../lib/auth-guards'
import { useAuthSession } from '../lib/auth-queries'
import { formatDa } from '../models/product'

export const Route = createFileRoute('/my-account')({
  ssr: false,
  beforeLoad: () => requireAuthentication('/my-account'),
  component: MyAccountPage,
})

function MyAccountPage() {
  const sessionQuery = useAuthSession()
  const ordersQuery = useQuery({
    queryKey: ['orders', 'mine', 'account-overview'],
    queryFn: () => fetchMyOrders({ page: 1, perPage: 3 }),
  })

  const user = sessionQuery.data
  const recentOrders = ordersQuery.data?.items ?? []
  const profileName = user?.full_name || user?.email || 'Client Fast-Agros'
  const companyName = user?.company_name || 'Entreprise cliente'
  const accountType = user?.account_type || 'Compte professionnel'
  const location = [
    user?.country_name,
    user?.state_name ?? user?.wilaya,
    user?.address,
  ]
    .filter(Boolean)
    .join(' | ')

  return (
    <main className="bg-(--surface) min-h-screen px-6 py-12 md:py-20 lg:px-8">
      <div className="mx-auto max-w-[1280px]">
        <header className="mb-12 md:mb-16">
          <p className="text-secondary m-0 text-xs font-bold tracking-[0.18em] uppercase">
            Espace client
          </p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="font-headline m-0 text-4xl font-extrabold tracking-tight text-(--on-surface) md:text-5xl">
                Mon compte
              </h1>
              <p className="text-(--on-surface-variant) mt-4 max-w-2xl text-sm leading-7 md:text-base">
                Gérez votre profil professionnel, vos informations de livraison et
                vos dernières commandes dans un seul espace.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/orders"
                className="bg-(--surface-container-highest) text-(--on-surface) rounded-lg px-5 py-3 text-sm font-bold no-underline transition hover:opacity-90"
              >
                Voir toutes les commandes
              </Link>
              <Link
                to="/catalogue"
                className="bg-(--secondary-container) text-(--on-secondary-container) rounded-lg px-5 py-3 text-sm font-bold no-underline transition hover:-translate-y-0.5"
              >
                Continuer mes achats
              </Link>
            </div>
          </div>
        </header>

        <section className="mb-14 grid gap-6 xl:grid-cols-[1.7fr_1fr]">
          <article className="bg-(--surface-container-lowest) relative overflow-hidden rounded-[28px] p-8 shadow-[0_32px_64px_-32px_rgba(26,28,25,0.12)] md:p-10">
            <div className="relative z-10">
              <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-secondary m-0 text-xs font-bold tracking-[0.16em] uppercase">
                    Profil entreprise
                  </p>
                  <h2 className="font-headline text-primary mt-3 text-3xl font-extrabold tracking-tight">
                    {companyName}
                  </h2>
                </div>
                <span className="bg-(--primary)/6 text-primary inline-flex w-fit rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.14em] uppercase">
                  {accountType}
                </span>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <InfoBlock label="Responsable principal" value={profileName} />
                <InfoBlock label="Email" value={user?.email || 'Non disponible'} mono />
                <InfoBlock label="Téléphone" value={user?.phone || 'Non renseigné'} />
                <InfoBlock
                  label="Pays"
                  value={user?.country_name || '—'}
                />
                <InfoBlock
                  label="Wilaya / état"
                  value={user?.state_name || user?.wilaya || 'Non renseigné'}
                />
                <InfoBlock label="RC" value={user?.rc_number || 'Non renseigné'} mono />
                <InfoBlock label="NIF" value={user?.nif || 'Non renseigné'} mono />
              </div>
            </div>

            <div className="pointer-events-none absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-[0.05]">
              <span className="material-symbols-outlined text-[220px]">domain</span>
            </div>
          </article>

          <article className="bg-(--surface-container-low) rounded-[28px] p-8 md:p-10">
            <p className="text-primary m-0 text-xs font-bold tracking-[0.16em] uppercase">
              Aperçu rapide
            </p>
            <h2 className="font-headline mt-4 text-2xl font-bold tracking-tight text-(--on-surface)">
              Votre espace de gestion
            </h2>
            <p className="text-(--on-surface-variant) mt-3 text-sm leading-7">
              Retrouvez les informations liées à votre compte professionnel et suivez
              vos commandes sans quitter le parcours principal du site.
            </p>

            <dl className="mt-8 space-y-5">
              <MetricRow label="Statut" value="Compte actif" />
              <MetricRow label="Adresse principale" value={location || 'Aucune adresse enregistrée'} />
              <MetricRow label="Commandes récentes" value={String(recentOrders.length)} />
            </dl>
          </article>
        </section>

        <section className="mb-14 grid gap-6 lg:grid-cols-3">
          <article className="bg-(--surface-container-low) rounded-[24px] p-7 lg:col-span-2">
            <div className="mb-6 flex items-center gap-3">
              <span className="bg-secondary h-6 w-2 rounded-full" />
              <h2 className="font-headline m-0 text-2xl font-bold text-(--on-surface)">
                Adresse principale
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="bg-(--surface-container-lowest) rounded-[20px] p-6">
                <p className="text-secondary m-0 text-xs font-bold tracking-[0.16em] uppercase">
                  Livraison par défaut
                </p>
                <p className="mt-4 text-sm leading-7 whitespace-pre-line text-(--on-surface)">
                  {formatAddress(user?.address, user?.state_name, user?.country_name)}
                </p>
              </div>
              <div className="bg-(--surface-container-lowest) rounded-[20px] p-6">
                <p className="text-secondary m-0 text-xs font-bold tracking-[0.16em] uppercase">
                  Actions utiles
                </p>
                <div className="mt-4 space-y-3">
                  <AccountLink
                    to="/orders"
                    icon="receipt_long"
                    title="Historique des commandes"
                    description="Consultez vos achats, statuts et détails de livraison."
                  />
                  <AccountLink
                    to="/checkout"
                    icon="local_shipping"
                    title="Préparer une nouvelle commande"
                    description="Relancez rapidement un achat depuis votre panier."
                  />
                </div>
              </div>
            </div>
          </article>

          <article className="bg-(--surface-container-low) rounded-[24px] p-7">
            <div className="mb-6 flex items-center gap-3">
              <span className="bg-secondary h-6 w-2 rounded-full" />
              <h2 className="font-headline m-0 text-2xl font-bold text-(--on-surface)">
                Contact
              </h2>
            </div>
            <div className="space-y-4">
              <ContactCard icon="person" label="Nom" value={profileName} />
              <ContactCard icon="mail" label="Email" value={user?.email || 'Non disponible'} />
              <ContactCard icon="call" label="Téléphone" value={user?.phone || 'Non renseigné'} />
            </div>
          </article>
        </section>

        <section>
          <div className="mb-6 flex items-center gap-3">
            <span className="bg-secondary h-6 w-2 rounded-full" />
            <h2 className="font-headline m-0 text-2xl font-bold text-(--on-surface)">
              Commandes récentes
            </h2>
          </div>

          {ordersQuery.isLoading ? (
            <div className="bg-(--surface-container-low) rounded-[24px] p-8 text-sm text-(--on-surface-variant)">
              Chargement des commandes...
            </div>
          ) : null}

          {ordersQuery.isError ? (
            <div className="bg-(--surface-container-low) rounded-[24px] p-8 text-sm text-(--error)">
              {ordersQuery.error instanceof Error
                ? ordersQuery.error.message
                : 'Impossible de charger vos commandes.'}
            </div>
          ) : null}

          {!ordersQuery.isLoading && !ordersQuery.isError && recentOrders.length === 0 ? (
            <div className="bg-(--surface-container-low) rounded-[24px] p-8">
              <p className="m-0 text-lg font-bold text-(--on-surface)">
                Aucune commande enregistrée pour le moment.
              </p>
              <p className="text-(--on-surface-variant) mt-3 text-sm leading-7">
                Parcourez le catalogue pour démarrer votre première commande
                professionnelle.
              </p>
              <Link
                to="/catalogue"
                className="text-primary mt-4 inline-flex text-sm font-bold no-underline hover:underline"
              >
                Aller au catalogue
              </Link>
            </div>
          ) : null}

          {!ordersQuery.isLoading && !ordersQuery.isError && recentOrders.length > 0 ? (
            <div className="grid gap-4">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  to="/orders/$orderId"
                  params={{ orderId: String(order.id) }}
                  className="bg-(--surface-container-low) grid gap-4 rounded-[24px] p-6 no-underline transition hover:bg-(--surface-container) md:grid-cols-[1.2fr_0.8fr_auto]"
                >
                  <div>
                    <p className="text-secondary m-0 text-xs font-bold tracking-[0.16em] uppercase">
                      {order.order_number}
                    </p>
                    <p className="mt-3 text-lg font-black text-(--on-surface)">
                      {order.company_name}
                    </p>
                    <p className="text-(--on-surface-variant) mt-2 text-sm">
                      {new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-(--on-surface-variant) m-0 text-xs font-bold tracking-[0.16em] uppercase">
                      Total
                    </p>
                    <p className="text-primary mt-3 text-2xl font-black">
                      {formatDa(Math.round(order.total_cents / 100))}
                    </p>
                  </div>
                  <div className="flex items-center justify-start md:justify-end">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold tracking-[0.12em] uppercase ${getStatusClasses(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  )
}

function InfoBlock({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="bg-(--surface-container-low) rounded-[20px] p-5">
      <p className="text-(--on-surface-variant) m-0 text-xs font-bold tracking-[0.14em] uppercase">
        {label}
      </p>
      <p className={`m-0 mt-3 text-base font-semibold text-(--on-surface) ${mono ? 'font-mono' : ''}`}>
        {value}
      </p>
    </div>
  )
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-[color-mix(in_oklab,var(--outline-variant)_20%,transparent)] flex items-center justify-between gap-4 border-b pb-4 last:border-b-0 last:pb-0">
      <dt className="text-(--on-surface-variant) text-sm">{label}</dt>
      <dd className="text-(--on-surface) m-0 text-right text-sm font-bold">{value}</dd>
    </div>
  )
}

function ContactCard({
  icon,
  label,
  value,
}: {
  icon: string
  label: string
  value: string
}) {
  return (
    <div className="bg-(--surface-container-lowest) flex items-start gap-4 rounded-[20px] p-5">
      <span className="material-symbols-outlined text-primary">{icon}</span>
      <div>
        <p className="text-(--on-surface-variant) m-0 text-xs font-bold tracking-[0.14em] uppercase">
          {label}
        </p>
        <p className="m-0 mt-2 text-sm leading-6 font-semibold text-(--on-surface)">{value}</p>
      </div>
    </div>
  )
}

function AccountLink({
  to,
  icon,
  title,
  description,
}: {
  to: '/orders' | '/checkout'
  icon: string
  title: string
  description: string
}) {
  return (
    <Link
      to={to}
      className="bg-(--surface-container-low) hover:bg-(--surface-container-highest) flex items-start gap-4 rounded-[18px] p-4 no-underline transition"
    >
      <span className="material-symbols-outlined text-primary mt-0.5">{icon}</span>
      <span className="block">
        <span className="block text-sm font-bold text-(--on-surface)">{title}</span>
        <span className="text-(--on-surface-variant) mt-1 block text-sm leading-6">
          {description}
        </span>
      </span>
    </Link>
  )
}

function formatAddress(address?: string, state?: string, country?: string) {
  return [address, state, country].filter(Boolean).join('\n')
}

function getStatusClasses(status: string) {
  const normalized = status.toLowerCase()
  if (normalized.includes('livr')) {
    return 'bg-[color-mix(in_oklab,var(--primary)_12%,white)] text-primary'
  }
  if (normalized.includes('cours') || normalized.includes('attente') || normalized.includes('pending')) {
    return 'bg-[color-mix(in_oklab,var(--secondary-container)_60%,white)] text-(--on-secondary-container)'
  }
  if (normalized.includes('annul')) {
    return 'bg-[color-mix(in_oklab,var(--error)_12%,white)] text-(--error)'
  }
  return 'bg-(--surface-container-highest) text-(--on-surface-variant)'
}
