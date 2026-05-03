import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo } from 'react'
import { fetchCatalogueCountries, fetchCatalogueStates } from '../lib/api'
import { getAuthToken, getAuthUser } from '../lib/auth-session'
import { getActiveCartTier, useCart } from '../lib/cart'
import { formatShippingLine } from '../lib/logistics-label'
import { formatDa, taxDaFromLineSubtotal } from '../models/product'

export const Route = createFileRoute('/cart')({
  component: CartPage,
})

function CartPage() {
  const navigate = useNavigate()
  const { items, clearCart, removeItem, updateQuantity } = useCart()
  const authUser = getAuthUser()

  const countriesQuery = useQuery({
    queryKey: ['catalogue', 'geo', 'countries'],
    queryFn: fetchCatalogueCountries,
  })
  const countryId =
    authUser?.country_id ?? countriesQuery.data?.items[0]?.id ?? 0
  const statesQuery = useQuery({
    queryKey: ['catalogue', 'geo', 'states', countryId],
    queryFn: () => fetchCatalogueStates(countryId),
    enabled: countryId > 0,
  })

  const states = statesQuery.data?.items ?? []
  const userStateId = authUser?.state_id
  const matchedUserState =
    userStateId != null ? states.find((s) => s.id === userStateId) : undefined

  const needsGeoForUserZone = !!getAuthToken() && userStateId != null
  const geoResolved =
    countryId > 0 &&
    !statesQuery.isLoading &&
    !statesQuery.isFetching &&
    !statesQuery.isError
  const waitingForGeoToValidateUser = needsGeoForUserZone && !geoResolved
  const userDeliveryZoneInvalid =
    needsGeoForUserZone && geoResolved && !matchedUserState

  const summary = useMemo(() => {
    const subtotal = items.reduce((sum, item) => {
      const activeTier = getActiveCartTier(item)
      return sum + activeTier.amountDa * item.quantity
    }, 0)

    const taxes = items.reduce((sum, item) => {
      const activeTier = getActiveCartTier(item)
      const lineSub = activeTier.amountDa * item.quantity
      return sum + taxDaFromLineSubtotal(lineSub, item.taxRateBps)
    }, 0)

    const totalWeightKg = items.reduce(
      (sum, item) => sum + item.unitWeightKg * item.quantity,
      0,
    )
    // Logged-in user with a profile state not in the active catalogue: no fallback rate.
    const st =
      userDeliveryZoneInvalid
        ? undefined
        : matchedUserState ?? (userStateId == null ? states[0] : undefined)
    const shippingCents =
      st?.shipping_cents ?? (userDeliveryZoneInvalid ? 0 : 650000)
    const logisticsFee =
      items.length === 0 ? 0 : Math.round(shippingCents / 100)

    return {
      subtotal,
      totalWeightKg,
      logisticsFee,
      shippingCentsUsed: items.length === 0 ? 0 : shippingCents,
      deliveryStateName: userDeliveryZoneInvalid ? undefined : st?.name,
      taxes,
      total: subtotal + logisticsFee + taxes,
      totalUnits: items.reduce((sum, item) => sum + item.quantity, 0),
    }
  }, [
    items,
    states,
    matchedUserState,
    userStateId,
    userDeliveryZoneInvalid,
  ])

  const canProceedToCheckout =
    items.length > 0 &&
    !userDeliveryZoneInvalid &&
    !waitingForGeoToValidateUser

  return (
    <main className="bg-(--surface) text-(--on-surface) min-h-screen px-6 py-12 md:py-20 lg:px-8">
      <div className="mx-auto max-w-[1360px]">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_400px]">
          <section>
            <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="text-secondary mb-3 block text-xs font-bold tracking-[0.2em] uppercase">
                  Logistique de gros
                </span>
                <h1 className="text-primary m-0 text-4xl font-black tracking-[-0.04em] md:text-6xl">
                  Votre Panier
                </h1>
                <p className="text-(--on-surface-variant) m-0 mt-4 max-w-2xl text-sm leading-relaxed md:text-base">
                  Validez vos quantites, consolidez votre chargement et preparez
                  votre livraison industrielle.
                </p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-(--outline) m-0 text-xs font-bold tracking-[0.18em] uppercase">
                  Poids total estime
                </p>
                <p className="m-0 mt-2 text-3xl font-black tracking-tight">
                  {(summary.totalWeightKg / 1000).toLocaleString('fr-FR', {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}{' '}
                  <span className="text-lg">TONNES</span>
                </p>
              </div>
            </div>

            {items.length === 0 ? (
              <div className="bg-(--surface-container-low) rounded-3xl px-8 py-14">
                <p className="text-secondary m-0 text-xs font-bold tracking-[0.18em] uppercase">
                  Panier vide
                </p>
                <h2 className="m-0 mt-4 text-3xl font-black tracking-tight">
                  Reprenez vos achats.
                </h2>
                <p className="text-(--on-surface-variant) m-0 mt-4 max-w-xl">
                  Votre espace panier est pret. Ajoutez des references depuis le
                  catalogue pour constituer votre prochaine commande B2B.
                </p>
                <Link
                  to="/catalogue"
                  className="bg-primary text-(--on-primary) mt-8 inline-flex rounded-lg px-6 py-3 text-sm font-bold no-underline"
                >
                  Explorer le catalogue
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {items.map((item) => {
                    const activeTier = getActiveCartTier(item)
                    const lineTotal = activeTier.amountDa * item.quantity

                    return (
                      <article
                        key={item.productId}
                        className="bg-(--surface-container-low) hover:bg-(--surface-container) rounded-3xl p-6 transition-colors"
                      >
                        <div className="flex flex-col gap-6 md:flex-row md:items-center">
                          <div className="bg-(--surface-container-highest) h-32 w-full overflow-hidden rounded-xl md:w-32 md:shrink-0">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="h-full w-full object-contain"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                              <div>
                                <h2 className="m-0 text-xl font-bold tracking-tight uppercase">
                                  {item.name}
                                </h2>
                                <p className="text-(--outline) m-0 mt-2 text-sm font-medium">
                                  Ref: #{item.productId}
                                </p>
                              </div>
                              <p className="m-0 text-xl font-black">{formatDa(lineTotal)}</p>
                            </div>

                            <div className="mt-5 flex flex-wrap items-center gap-4">
                              <label className="bg-(--surface-container-lowest) border-primary flex h-11 items-center gap-3 overflow-hidden border-b-2 px-4">
                                <span className="text-(--outline) text-[11px] font-bold tracking-[0.16em] uppercase">
                                  Qte
                                </span>
                                <input
                                  type="number"
                                  min={1}
                                  value={item.quantity}
                                  onChange={(e) =>
                                    updateQuantity(item.productId, Number(e.target.value))
                                  }
                                  className="w-20 border-none bg-transparent p-0 text-lg font-black outline-none"
                                />
                                <span className="text-(--outline) text-[11px] font-bold tracking-[0.16em] uppercase">
                                  {item.unitLabel}
                                </span>
                              </label>

                              <span className="text-(--on-surface-variant) text-xs">
                                {formatDa(activeTier.amountDa)} /{' '}
                                {item.unitLabel.replace(/s$/, '')} ·{' '}
                                {(item.unitWeightKg * item.quantity).toLocaleString('fr-FR', {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 2,
                                })}{' '}
                                kg · TVA{' '}
                                {(item.taxRateBps / 100).toLocaleString('fr-FR', {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 2,
                                })}
                                %
                              </span>
                              <button
                                type="button"
                                onClick={() => removeItem(item.productId)}
                                className="text-(--error) ml-auto inline-flex items-center rounded-md bg-[color-mix(in_oklab,var(--error)_12%,white)] px-3 py-2 text-[11px] font-bold tracking-[0.16em] uppercase hover:bg-[color-mix(in_oklab,var(--error)_18%,white)]"
                              >
                                Retirer
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <Link
                    to="/catalogue"
                    className="text-primary inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] uppercase no-underline"
                  >
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    Continuer les achats
                  </Link>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-(--error) text-left text-xs font-bold tracking-[0.16em] uppercase"
                  >
                    Vider le panier
                  </button>
                </div>
              </>
            )}
          </section>

          <aside>
            <div className="bg-(--surface-container-low) sticky top-30 rounded-[1.75rem] p-8">
              <h2 className="text-primary m-0 text-2xl font-black tracking-tight">
                Recapitulatif
              </h2>

              <div className="mt-8 space-y-5">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-(--outline) text-xs font-bold tracking-[0.16em] uppercase">
                    Sous-total HT
                  </span>
                  <span className="text-lg font-bold">{formatDa(summary.subtotal)}</span>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-(--outline) text-xs font-bold tracking-[0.16em] uppercase">
                    Frais de logistique
                  </span>
                  <span className="max-w-[min(100%,14rem)] text-right text-lg font-bold leading-snug">
                    {formatShippingLine({
                      feeDa: summary.logisticsFee,
                      shippingCents: summary.shippingCentsUsed,
                      stateName: summary.deliveryStateName,
                      suppressFreeMessage: items.length === 0,
                    })}
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-(--outline) text-xs font-bold tracking-[0.16em] uppercase">
                    Taxes (TVA)
                  </span>
                  <span className="text-lg font-bold">{formatDa(summary.taxes)}</span>
                </div>
              </div>

              <div className="border-[color-mix(in_oklab,var(--outline-variant)_24%,transparent)] mt-8 border-t pt-8">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <span className="text-secondary block text-[10px] font-black tracking-[0.2em] uppercase">
                      Total a payer
                    </span>
                    <span className="text-4xl font-black tracking-[-0.04em]">
                      {formatDa(summary.total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {userDeliveryZoneInvalid ? (
                  <div
                    className="bg-[color-mix(in_oklab,var(--error)_12%,white)] text-(--error) rounded-lg px-4 py-3 text-sm leading-relaxed"
                    role="alert"
                  >
                    Votre wilaya enregistree n&apos;est plus desservie ou inactive.
                    Mettez a jour votre zone de livraison (contact support) avant de
                    commander.
                  </div>
                ) : null}
                {waitingForGeoToValidateUser ? (
                  <p className="text-(--on-surface-variant) m-0 text-center text-xs">
                    Verification de votre zone de livraison...
                  </p>
                ) : null}
                <button
                  type="button"
                  disabled={!canProceedToCheckout}
                  onClick={() => {
                    if (!canProceedToCheckout) return
                    void navigate({ to: '/checkout' })
                  }}
                  className="text-(--on-primary) flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-[linear-gradient(120deg,var(--primary),var(--primary-container))] text-sm font-black tracking-[0.12em] uppercase no-underline disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Passer a la livraison
                  <span className="material-symbols-outlined text-base">chevron_right</span>
                </button>
                <p className="text-(--outline-variant) m-0 text-center text-[10px] tracking-[0.14em] uppercase">
                  Transaction securisee par Fast-Agros Logistics
                </p>
              </div>

              <div className="bg-(--surface-container-highest) mt-10 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-primary">
                    local_shipping
                  </span>
                  <div>
                    <p className="text-primary m-0 text-xs font-bold tracking-[0.12em] uppercase">
                      Livraison industrielle
                    </p>
                    <p className="text-(--on-surface-variant) m-0 mt-2 text-sm leading-relaxed">
                      {summary.totalWeightKg > 5000
                        ? 'Votre chargement depasse 5 tonnes et necessite un acces poids lourds au point de dechargement.'
                        : 'Votre volume reste compatible avec une livraison standard renforcee sous 48h.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-(--surface-container-lowest) mt-6 rounded-lg px-4 py-3">
                <p className="text-(--outline-variant) m-0 text-xs font-bold tracking-[0.14em] uppercase">
                  Articles
                </p>
                <p className="m-0 mt-2 text-lg font-black">
                  {summary.totalUnits.toLocaleString('fr-FR')} unites
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
