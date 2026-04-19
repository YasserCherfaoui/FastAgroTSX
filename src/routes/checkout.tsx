import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import {
  createOrderRequest,
  fetchCatalogueCountries,
  fetchCatalogueStates,
} from '../lib/api'
import { getAuthUser } from '../lib/auth-session'
import { requireAuthentication } from '../lib/auth-guards'
import { getActiveCartTier, useCart } from '../lib/cart'
import { formatShippingLine } from '../lib/logistics-label'
import { formatDa, taxDaFromLineSubtotal } from '../models/product'

type ShippingForm = {
  countryId: number
  stateId: number
  city: string
  address: string
  contactPerson: string
  phone: string
  instructions: string
}

export const Route = createFileRoute('/checkout')({
  ssr: false,
  beforeLoad: () => requireAuthentication('/checkout'),
  component: CheckoutPage,
})

function CheckoutPage() {
  const navigate = useNavigate()
  const { items, clearCart } = useCart()
  const authUser = getAuthUser()
  const [form, setForm] = useState<ShippingForm>(() => ({
    countryId: authUser?.country_id ?? 0,
    stateId: authUser?.state_id ?? 0,
    city: '',
    address: authUser?.address || '',
    contactPerson: authUser?.full_name || '',
    phone: authUser?.phone || '',
    instructions: '',
  }))

  const countriesQuery = useQuery({
    queryKey: ['catalogue', 'geo', 'countries'],
    queryFn: fetchCatalogueCountries,
  })

  const countryId = form.countryId
  const statesQuery = useQuery({
    queryKey: ['catalogue', 'geo', 'states', countryId],
    queryFn: () => fetchCatalogueStates(countryId),
    enabled: countryId > 0,
  })

  // Prefill country from profile only (no default first country).
  useEffect(() => {
    const list = countriesQuery.data?.items ?? []
    if (!list.length || form.countryId !== 0) return
    if (
      authUser?.country_id &&
      list.some((c) => c.id === authUser.country_id)
    ) {
      setForm((f) => ({ ...f, countryId: authUser.country_id! }))
    }
  }, [countriesQuery.data, authUser?.country_id, form.countryId])

  // Prefill wilaya from profile only when it belongs to the selected country (no default first state).
  useEffect(() => {
    const list = statesQuery.data?.items ?? []
    if (!list.length || form.countryId <= 0) return
    const authStateOk =
      authUser?.country_id === form.countryId &&
      authUser?.state_id != null &&
      list.some((s) => s.id === authUser.state_id)
    if (authStateOk && form.stateId === 0) {
      setForm((f) => ({ ...f, stateId: authUser.state_id! }))
      return
    }
    if (
      form.stateId !== 0 &&
      !list.some((s) => s.id === form.stateId)
    ) {
      setForm((f) => ({ ...f, stateId: 0 }))
    }
  }, [
    statesQuery.data,
    authUser?.country_id,
    authUser?.state_id,
    form.countryId,
    form.stateId,
  ])

  const orderMutation = useMutation({
    mutationFn: createOrderRequest,
    onSuccess: async (order) => {
      clearCart()
      await navigate({
        to: '/orders/success/$orderId',
        params: { orderId: String(order.id) },
      })
    },
  })

  useEffect(() => {
    if (items.length === 0) {
      void navigate({ to: '/cart' })
    }
  }, [items.length, navigate])

  const selectedState = useMemo(() => {
    const list = statesQuery.data?.items ?? []
    return list.find((s) => s.id === form.stateId)
  }, [statesQuery.data, form.stateId])

  const countriesReady =
    !countriesQuery.isLoading &&
    !countriesQuery.isError &&
    (countriesQuery.data?.items?.length ?? 0) > 0
  /** When a country is chosen, wait for its zones list before allowing submit. */
  const statesReadyForCountry =
    form.countryId <= 0 ||
    (!statesQuery.isLoading && !statesQuery.isError)

  const canPlaceOrder =
    items.length > 0 &&
    countriesReady &&
    form.countryId > 0 &&
    form.stateId > 0 &&
    statesReadyForCountry &&
    !!selectedState

  const summary = useMemo(() => {
    const subtotal = items.reduce((sum, item) => {
      const tier = getActiveCartTier(item)
      return sum + tier.amountDa * item.quantity
    }, 0)
    const taxes = items.reduce((sum, item) => {
      const tier = getActiveCartTier(item)
      const lineSub = tier.amountDa * item.quantity
      return sum + taxDaFromLineSubtotal(lineSub, item.taxRateBps)
    }, 0)
    const totalWeightKg = items.reduce(
      (sum, item) => sum + item.unitWeightKg * item.quantity,
      0,
    )
    const shippingCents = selectedState?.shipping_cents ?? 0
    const logisticsFee = Math.round(shippingCents / 100)

    return {
      subtotal,
      logisticsFee,
      taxes,
      totalWeightKg,
      total: subtotal + logisticsFee + taxes,
    }
  }, [items, selectedState])

  const updateField = <K extends keyof ShippingForm>(field: K, value: ShippingForm[K]) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canPlaceOrder) return
    try {
      await orderMutation.mutateAsync({
        state_id: form.stateId,
        city: form.city.trim(),
        address: form.address.trim(),
        contact_person: form.contactPerson.trim(),
        phone: form.phone.trim(),
        instructions: form.instructions.trim(),
        items: items.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
        })),
      })
    } catch {
      /* surfaced below */
    }
  }

  return (
    <main className="bg-(--surface) text-(--on-surface) min-h-screen px-6 py-12 md:py-20 lg:px-8">
      <div className="mx-auto max-w-[1360px]">
        <header className="mb-12">
          <span className="text-secondary block text-xs font-bold tracking-[0.2em] uppercase">
            B2B Logistic Fulfillment Hub
          </span>
          <h1 className="m-0 mt-3 text-4xl font-black tracking-[-0.04em] md:text-6xl">
            Finalize Order
          </h1>
          <p className="text-(--on-surface-variant) m-0 mt-4 max-w-2xl text-sm leading-relaxed md:text-base">
            Prepare your warehouse drop-off details, confirm your logistics contact,
            and complete your wholesale order with cash-on-delivery settlement.
          </p>
        </header>

        <div className="grid items-start gap-16 lg:grid-cols-[minmax(0,1fr)_420px]">
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-12">
            <section>
              <div className="mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">local_shipping</span>
                <h2 className="text-primary m-0 text-xl font-black tracking-[0.12em] uppercase">
                  Shipping Information
                </h2>
              </div>

              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Field label="Country">
                    <select
                      value={form.countryId || ''}
                      onChange={(event) => {
                        const v = Number(event.target.value)
                        updateField('countryId', v)
                        updateField('stateId', 0)
                      }}
                      className="checkout-input"
                      disabled={countriesQuery.isLoading}
                      required
                    >
                      <option value="">Select country</option>
                      {(countriesQuery.data?.items ?? []).map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Wilaya / state">
                    <select
                      value={form.stateId || ''}
                      onChange={(event) =>
                        updateField('stateId', Number(event.target.value))
                      }
                      className="checkout-input"
                      disabled={form.countryId <= 0 || statesQuery.isLoading}
                      required
                    >
                      <option value="">Select zone</option>
                      {(statesQuery.data?.items ?? []).map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.code} {s.name}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="City">
                    <input
                      type="text"
                      value={form.city}
                      onChange={(event) => updateField('city', event.target.value)}
                      className="checkout-input"
                      placeholder="e.g. Dar El Beida"
                      required
                    />
                  </Field>
                </div>

                <Field label="Specific Warehouse/Store Address">
                  <input
                    type="text"
                    value={form.address}
                    onChange={(event) => updateField('address', event.target.value)}
                    className="checkout-input"
                    placeholder="Unit number, industrial zone, street name"
                    required
                  />
                </Field>

                <div className="grid gap-6 md:grid-cols-2">
                  <Field label="Contact Person">
                    <input
                      type="text"
                      value={form.contactPerson}
                      onChange={(event) => updateField('contactPerson', event.target.value)}
                      className="checkout-input"
                      placeholder="Logistics manager name"
                      required
                    />
                  </Field>

                  <Field label="Phone Number">
                    <div className="focus-within:bg-(--surface-container-highest) focus-within:shadow-[inset_0_-2px_0_var(--primary)] flex min-h-11 items-stretch overflow-hidden rounded-xl bg-(--surface-container-lowest) shadow-[inset_0_-2px_0_transparent] transition-[background-color,box-shadow]">
                      <span className="text-(--on-surface-variant) flex shrink-0 items-center border-r border-[color-mix(in_oklab,var(--outline-variant)_40%,transparent)] px-3 text-sm font-bold select-none">
                        +213
                      </span>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(event) => updateField('phone', event.target.value)}
                        className="min-h-11 min-w-0 flex-1 border-0 bg-transparent px-3 py-3 text-(--on-surface) outline-none placeholder:text-[color-mix(in_oklab,var(--on-surface-variant)_75%,white)]"
                        placeholder="0XXXXXXX"
                        required
                      />
                    </div>
                  </Field>
                </div>

                <Field label="Delivery Instructions">
                  <textarea
                    value={form.instructions}
                    onChange={(event) => updateField('instructions', event.target.value)}
                    className="checkout-input min-h-32 resize-none py-4"
                    placeholder='e.g. "Dock 4 access", "Forklift available", "No delivery after 4 PM"'
                  />
                </Field>
              </div>
            </section>

            <div className="relative overflow-hidden rounded-[1.75rem] bg-(--surface-container-low) min-h-72">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdMS5nxkaH4he9KmkNS3kff14mWwOb1OOKHVPK-kPplIlt2e6VqTr-s0LZzeQYIw8z2LXNAYjHO37jELHynIoL1OeQEvXJSp2ko-EBfGnkzP9n_KmxGPMjXIuvDOKFa7eNsBZlHZmNGDvgfSQjfYFcrx8h1TUoCKEF_vMKkt4L5o-rGELkZGCcI3itjJlSiwQAEFc7PF6orX1g3XV6Cp7yvlSmAJyPfxEG8MCECtdWfK_bbHDX4ki3bowC4L3X-14CIzpA7A0J3iI"
                alt="Industrial warehouse interior"
                className="absolute inset-0 h-full w-full object-cover opacity-80 mix-blend-multiply"
              />
              <div className="absolute inset-0 bg-linear-to-t from-(--surface) via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <div className="text-primary flex items-center gap-2 text-sm font-bold tracking-[0.08em] uppercase">
                  <span className="material-symbols-outlined text-base">verified</span>
                  Certified Fulfillment Partner
                </div>
                <p className="text-(--on-surface) m-0 mt-3 max-w-md text-sm leading-relaxed">
                  Industrial staging, pallet-ready handling, and scheduled receiving
                  windows for high-volume orders across Algeria.
                </p>
              </div>
            </div>

            {orderMutation.isError ? (
              <div className="bg-(--error-container) text-(--error) rounded-[1.75rem] px-6 py-5">
                <p className="m-0 text-xs font-bold tracking-[0.16em] uppercase">
                  Order creation failed
                </p>
                <p className="m-0 mt-2 text-sm leading-relaxed">
                  {orderMutation.error instanceof Error
                    ? orderMutation.error.message
                    : 'Unable to submit your order right now.'}
                </p>
              </div>
            ) : null}
          </form>

          <aside className="lg:sticky lg:top-30">
            <div className="bg-(--surface-container-low) rounded-[1.75rem] p-8">
              <h2 className="m-0 text-2xl font-black tracking-tight">Order Summary</h2>

              <div className="mt-8 space-y-5">
                {items.map((item) => {
                  const tier = getActiveCartTier(item)
                  return (
                  <div key={item.productId} className="flex items-start justify-between gap-4">
                    <div>
                      <p className="m-0 font-bold">{item.name}</p>
                      <p className="text-(--on-surface-variant) m-0 mt-1 text-xs">
                        {item.quantity} {item.unitLabel} × {formatDa(tier.amountDa)} ·{' '}
                        {(item.unitWeightKg * item.quantity).toLocaleString('fr-FR', {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2,
                        })}{' '}
                        kg · TVA {(item.taxRateBps / 100).toLocaleString('fr-FR', {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2,
                        })}
                        %
                      </p>
                    </div>
                    <p className="m-0 font-headline text-lg font-bold">
                      {formatDa(tier.amountDa * item.quantity)}
                    </p>
                  </div>
                )})}
              </div>

              <div className="mt-8 space-y-4">
                <SummaryRow label="Sous-total HT" value={formatDa(summary.subtotal)} />
                <SummaryRow
                  label="Logistics & Handling"
                  value={formatShippingLine({
                    feeDa: summary.logisticsFee,
                    shippingCents: selectedState?.shipping_cents ?? 0,
                    stateName: selectedState?.name,
                    suppressFreeMessage: items.length === 0,
                  })}
                />
                <SummaryRow label="Taxes (TVA)" value={formatDa(summary.taxes)} />
              </div>

              <div className="border-[color-mix(in_oklab,var(--outline-variant)_24%,transparent)] mt-8 border-t pt-8">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <span className="text-secondary block text-[10px] font-black tracking-[0.2em] uppercase">
                      Grand Total
                    </span>
                    <span className="text-primary mt-2 block text-4xl font-black tracking-[-0.04em]">
                      {formatDa(summary.total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-(--surface-container-lowest) mt-8 rounded-xl p-6">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-secondary text-xs font-bold tracking-[0.16em] uppercase">
                    Payment Method
                  </span>
                  <span className="bg-secondary h-2.5 w-2.5 rounded-full" />
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary">payments</span>
                  <span className="font-headline text-lg font-bold">
                    Paiement a la livraison
                  </span>
                </div>
                <p className="text-(--on-surface-variant) m-0 mt-3 text-sm leading-relaxed">
                  Pay in cash or by bank check directly to the logistics officer upon
                  delivery and inventory verification.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-4">
                {!canPlaceOrder && items.length > 0 ? (
                  <p className="text-(--error) m-0 text-center text-xs leading-relaxed" role="status">
                    Select a country and a wilaya (delivery zone) before confirming your
                    order.
                  </p>
                ) : null}
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={orderMutation.isPending || !canPlaceOrder}
                  className="text-(--on-primary) flex h-16 w-full items-center justify-center gap-3 rounded-lg bg-[linear-gradient(120deg,var(--primary),var(--primary-container))] text-sm font-black tracking-[0.16em] uppercase disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {orderMutation.isPending ? 'Submitting Order' : 'Confirm Order'}
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
                <div className="text-(--on-surface-variant) flex items-center justify-center gap-2 text-[10px] font-bold tracking-[0.14em] uppercase">
                  <span className="material-symbols-outlined text-sm">lock</span>
                  Secured B2B transaction terminal
                </div>
              </div>

              <div className="bg-(--surface-container-highest) mt-8 rounded-xl p-5">
                <p className="text-primary m-0 text-xs font-bold tracking-[0.16em] uppercase">
                  Delivery profile
                </p>
                <p className="text-(--on-surface-variant) m-0 mt-3 text-sm leading-relaxed">
                  {summary.totalWeightKg > 5000
                    ? 'This load exceeds 5 tonnes and requires a truck-accessible unloading zone.'
                    : selectedState && selectedState.shipping_cents === 0
                      ? `Free delivery on ${selectedState.name}.`
                      : 'Shipping follows the rate configured for your selected delivery zone.'}
                </p>
              </div>

              <Link
                to="/cart"
                className="text-primary mt-6 inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] uppercase no-underline"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Back to cart
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="block space-y-2">
      <span className="text-secondary block text-xs font-bold tracking-[0.16em] uppercase">
        {label}
      </span>
      {children}
    </label>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-(--on-surface-variant) text-xs font-bold tracking-[0.16em] uppercase">
        {label}
      </span>
      <span className="max-w-[min(100%,14rem)] text-right text-lg font-bold leading-snug">
        {value}
      </span>
    </div>
  )
}
