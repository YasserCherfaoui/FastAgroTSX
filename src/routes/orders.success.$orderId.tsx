import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute, useRouterState } from '@tanstack/react-router'
import { useEffect, useMemo } from 'react'
import type { Order } from '../lib/api'
import { fetchMyOrder } from '../lib/api'
import { getAuthToken } from '../lib/auth-session'
import { trackPurchase } from '../lib/meta-pixel'
import { formatShippingLine } from '../lib/logistics-label'
import { formatDa } from '../models/product'

type SuccessLocationState = { order?: Order }

const ORDER_CONFIRM_STORAGE_PREFIX = 'fastagro_order_confirm_'

function readStoredOrder(id: number): Order | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(`${ORDER_CONFIRM_STORAGE_PREFIX}${id}`)
    if (!raw) return null
    return JSON.parse(raw) as Order
  } catch {
    return null
  }
}

export const Route = createFileRoute('/orders/success/$orderId')({
  ssr: false,
  component: OrderSuccessPage,
})

function OrderSuccessPage() {
  const { orderId } = Route.useParams()
  const id = Number(orderId)
  const isAuthed = !!getAuthToken()

  const locationOrder = useRouterState({
    select: (s) => (s.location.state as SuccessLocationState | undefined)?.order,
  })

  /** Same payload as checkout `onSuccess` — available for guests and logged-in users. */
  const fromCheckout = useMemo(() => {
    if (!Number.isFinite(id)) return undefined
    if (locationOrder && locationOrder.id === id) return locationOrder
    return readStoredOrder(id) ?? undefined
  }, [id, locationOrder])

  const needsApiOrder = isAuthed && Number.isFinite(id) && !fromCheckout

  const orderQuery = useQuery({
    queryKey: ['orders', 'mine', 'success', orderId],
    queryFn: () => fetchMyOrder(id),
    enabled: needsApiOrder,
  })

  const order = fromCheckout ?? orderQuery.data

  useEffect(() => {
    if (!order) return
    const storageKey = `meta_purchase_sent_${order.id}`
    try {
      if (sessionStorage.getItem(storageKey)) return
      sessionStorage.setItem(storageKey, '1')
    } catch {
      /* private mode */
    }

    const eventId = `purchase-${order.id}`
    const value = Math.round(order.total_cents) / 100
    const contentIds = (order.items ?? [])
      .map((item) => item.product_id)
      .filter((pid): pid is number => typeof pid === 'number' && pid > 0)
      .map(String)

    trackPurchase({
      value,
      currency: 'DZD',
      content_ids: contentIds,
      event_id: eventId,
    })
  }, [order])

  const showAuthedLoading = needsApiOrder && orderQuery.isLoading
  const showAuthedError = needsApiOrder && orderQuery.isError
  const showGuestMissing =
    !isAuthed && Number.isFinite(id) && !order && !showAuthedLoading
  const invalidId = !Number.isFinite(id)

  return (
    <main className="bg-(--surface) min-h-screen px-6 py-12 md:py-20 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        {invalidId ? (
          <div className="bg-(--surface-container-low) rounded-3xl p-8 text-(--error)">
            Commande invalide.
          </div>
        ) : null}

        {showAuthedLoading ? (
          <div className="bg-(--surface-container-low) rounded-3xl p-8 text-(--on-surface-variant)">
            Chargement de votre confirmation...
          </div>
        ) : null}

        {showAuthedError ? (
          <div className="bg-(--surface-container-low) rounded-3xl p-8 text-(--error)">
            {orderQuery.error instanceof Error
              ? orderQuery.error.message
              : 'Impossible de charger cette confirmation.'}
          </div>
        ) : null}

        {showGuestMissing ? (
          <div className="bg-(--surface-container-low) space-y-4 rounded-3xl p-8 text-(--on-surface-variant)">
            <p className="m-0 text-sm leading-7">
              Nous n&apos;avons pas pu afficher le detail de cette commande sur cet
              appareil. Si vous venez de commander, un recapitulatif a ete envoye a
              l&apos;adresse e-mail indiquee a la livraison.
            </p>
            <Link
              to="/"
              className="text-primary inline-flex text-sm font-extrabold no-underline"
            >
              Retour a l&apos;accueil
            </Link>
          </div>
        ) : null}

        {order ? (
          <>
            <section className="bg-(--surface-container-low) overflow-hidden rounded-[2rem]">
              <div className="grid gap-10 px-8 py-10 lg:grid-cols-[minmax(0,1.2fr)_360px] lg:px-10 lg:py-12">
                <div>
                  <span className="text-secondary block text-xs font-bold tracking-[0.2em] uppercase">
                    Merci
                  </span>
                  <h1 className="font-headline m-0 mt-4 text-4xl leading-tight font-black tracking-[-0.04em] text-(--on-surface) md:text-5xl">
                    Merci pour votre commande.
                  </h1>
                  <p className="text-(--on-surface-variant) m-0 mt-5 max-w-2xl text-sm leading-7 md:text-base">
                    {isAuthed ? (
                      <>
                        Nos equipes logistiques ont bien recu votre demande. Vous
                        pouvez suivre son evolution depuis votre espace commandes
                        pendant la preparation et l&apos;expedition.
                      </>
                    ) : (
                      <>
                        Nos equipes logistiques ont bien recu votre demande. Nous vous
                        contacterons a l&apos;adresse e-mail fournie pour la suite de
                        la preparation et de la livraison.
                      </>
                    )}
                  </p>

                  <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    <div className="bg-(--surface-container-lowest) rounded-2xl px-5 py-4">
                      <p className="text-(--outline) m-0 text-[11px] font-bold tracking-[0.16em] uppercase">
                        Numero
                      </p>
                      <p className="m-0 mt-2 text-lg font-black text-(--on-surface)">
                        {order.order_number}
                      </p>
                    </div>
                    <div className="bg-(--surface-container-lowest) rounded-2xl px-5 py-4">
                      <p className="text-(--outline) m-0 text-[11px] font-bold tracking-[0.16em] uppercase">
                        Statut
                      </p>
                      <p className="m-0 mt-2 text-lg font-black text-primary">
                        {order.status}
                      </p>
                    </div>
                    <div className="bg-(--surface-container-lowest) rounded-2xl px-5 py-4">
                      <p className="text-(--outline) m-0 text-[11px] font-bold tracking-[0.16em] uppercase">
                        Total
                      </p>
                      <p className="m-0 mt-2 text-lg font-black text-(--on-surface)">
                        {formatDa(Math.round(order.total_cents / 100))}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    {isAuthed ? (
                      <>
                        <Link
                          to="/orders/$orderId"
                          params={{ orderId: String(order.id) }}
                          className="bg-(--secondary-container) text-(--on-secondary-container) inline-flex h-13 items-center justify-center rounded-xl px-6 text-sm font-extrabold no-underline"
                        >
                          Voir le detail de la commande
                        </Link>
                        <Link
                          to="/orders"
                          className="text-primary border-primary inline-flex h-13 items-center justify-center rounded-xl border-2 px-6 text-sm font-extrabold no-underline hover:bg-[color-mix(in_oklab,var(--primary)_8%,transparent)]"
                        >
                          Mes commandes
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          search={{ redirect: '/' }}
                          className="bg-(--secondary-container) text-(--on-secondary-container) inline-flex h-13 items-center justify-center rounded-xl px-6 text-sm font-extrabold no-underline"
                        >
                          Creer un compte ou se connecter
                        </Link>
                        <Link
                          to="/"
                          className="text-primary border-primary inline-flex h-13 items-center justify-center rounded-xl border-2 px-6 text-sm font-extrabold no-underline hover:bg-[color-mix(in_oklab,var(--primary)_8%,transparent)]"
                        >
                          Retour a l&apos;accueil
                        </Link>
                      </>
                    )}
                  </div>
                </div>

                <aside className="bg-(--surface-container-lowest) rounded-[1.75rem] p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
                      <span className="material-symbols-outlined text-(--on-primary)">
                        check
                      </span>
                    </div>
                    <div>
                      <p className="text-primary m-0 text-xs font-bold tracking-[0.16em] uppercase">
                        Etapes suivantes
                      </p>
                      <p className="text-(--on-surface-variant) m-0 mt-3 text-sm leading-7">
                        Verification des stocks, preparation logistique, puis prise
                        de contact avant expedition.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    {[
                      'Confirmation interne de la commande',
                      'Preparation et planification de livraison',
                      'Appel ou message de coordination',
                    ].map((step) => (
                      <div
                        key={step}
                        className="bg-(--surface-container-low) flex items-center gap-3 rounded-xl px-4 py-3"
                      >
                        <span className="material-symbols-outlined text-primary text-base">
                          task_alt
                        </span>
                        <span className="text-sm font-medium text-(--on-surface)">
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </aside>
              </div>
            </section>

            <section className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
              <div className="bg-(--surface-container-low) rounded-3xl p-8">
                <h2 className="font-headline m-0 text-2xl font-black tracking-tight text-(--on-surface)">
                  Adresse de livraison
                </h2>
                <p className="text-(--on-surface-variant) m-0 mt-5 text-sm leading-7">
                  {order.contact_person}
                  <br />
                  {[
                    order.address,
                    order.city,
                    order.state_name || order.wilaya,
                    order.country_name,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                  <br />
                  {order.customer_phone}
                </p>

                {(order.items ?? []).length > 0 ? (
                  <div className="mt-8 space-y-3">
                    {(order.items ?? []).slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="bg-(--surface-container-lowest) flex items-center justify-between gap-4 rounded-2xl px-5 py-4"
                      >
                        <div>
                          <p className="m-0 text-sm font-bold text-(--on-surface)">
                            {item.product_name}
                          </p>
                          <p className="text-(--on-surface-variant) m-0 mt-1 text-xs">
                            {item.quantity} {item.unit_label || 'unites'}
                          </p>
                        </div>
                        <p className="m-0 text-sm font-black text-primary">
                          {formatDa(Math.round(item.line_subtotal_cents / 100))}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <aside className="bg-(--surface-container-low) rounded-3xl p-8">
                <h2 className="font-headline m-0 text-xl font-black tracking-tight text-primary">
                  Recapitulatif
                </h2>

                <div className="mt-8 space-y-4">
                  <SummaryRow
                    label="Sous-total"
                    value={formatDa(Math.round(order.subtotal_cents / 100))}
                  />
                  <SummaryRow
                    label="TVA"
                    value={formatDa(Math.round(order.tax_cents / 100))}
                  />
                  <SummaryRow
                    label="Livraison"
                    value={formatShippingLine({
                      feeDa: Math.round(order.shipping_cents / 100),
                      shippingCents: order.shipping_cents,
                      stateName: order.state_name || order.wilaya,
                    })}
                  />
                </div>

                <div className="border-[color-mix(in_oklab,var(--outline-variant)_24%,transparent)] mt-8 border-t pt-8">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <span className="text-secondary block text-[10px] font-black tracking-[0.2em] uppercase">
                        Total a payer
                      </span>
                      <span className="mt-2 block text-3xl font-black tracking-[-0.04em] text-(--on-surface)">
                        {formatDa(Math.round(order.total_cents / 100))}
                      </span>
                    </div>
                  </div>
                </div>
              </aside>
            </section>
          </>
        ) : null}
      </div>
    </main>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-(--on-surface-variant) text-sm">{label}</span>
      <span className="max-w-[min(100%,14rem)] text-right text-sm font-bold leading-snug text-(--on-surface)">
        {value}
      </span>
    </div>
  )
}
