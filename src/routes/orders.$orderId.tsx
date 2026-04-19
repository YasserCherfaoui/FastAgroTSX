import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { fetchMyOrder } from '../lib/api'
import { requireAuthentication } from '../lib/auth-guards'
import { formatDa } from '../models/product'

export const Route = createFileRoute('/orders/$orderId')({
  ssr: false,
  beforeLoad: () => requireAuthentication('/orders'),
  component: OrderDetailPage,
})

function OrderDetailPage() {
  const { orderId } = Route.useParams()
  const orderQuery = useQuery({
    queryKey: ['orders', 'mine', orderId],
    queryFn: () => fetchMyOrder(Number(orderId)),
  })

  const order = orderQuery.data

  return (
    <main className="bg-(--surface) min-h-screen px-6 py-12 md:py-20 lg:px-8">
      <div className="mx-auto max-w-[1100px]">
        <Link
          to="/orders"
          className="text-primary inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] uppercase no-underline"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Retour aux commandes
        </Link>

        {orderQuery.isLoading ? (
          <div className="bg-(--surface-container-low) mt-8 rounded-3xl p-8 text-(--on-surface-variant)">
            Chargement...
          </div>
        ) : null}

        {orderQuery.isError ? (
          <div className="bg-(--surface-container-low) mt-8 rounded-3xl p-8 text-red-700">
            {orderQuery.error instanceof Error
              ? orderQuery.error.message
              : 'Impossible de charger cette commande.'}
          </div>
        ) : null}

        {order ? (
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            <section className="bg-(--surface-container-low) rounded-3xl p-8">
              <p className="text-secondary m-0 text-xs font-bold tracking-[0.18em] uppercase">
                {order.order_number}
              </p>
              <h1 className="m-0 mt-3 text-3xl font-black tracking-tight text-(--on-surface)">
                Commande en statut: {order.status}
              </h1>

              <div className="mt-8 space-y-4">
                {(order.items ?? []).map((item) => (
                  <article
                    key={item.id}
                    className="bg-(--surface-container-lowest) rounded-2xl p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="m-0 font-bold text-(--on-surface)">{item.product_name}</p>
                        <p className="text-(--on-surface-variant) m-0 mt-2 text-sm">
                          {item.quantity} {item.unit_label || 'unites'} x{' '}
                          {formatDa(Math.round(item.unit_price_cents / 100))}
                        </p>
                      </div>
                      <p className="m-0 text-lg font-black text-primary">
                        {formatDa(Math.round(item.line_subtotal_cents / 100))}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <aside className="bg-(--surface-container-low) rounded-3xl p-8">
              <h2 className="m-0 text-xl font-black text-primary">Livraison</h2>
              <p className="m-0 mt-4 text-sm text-(--on-surface-variant)">
                {order.contact_person}
              </p>
              <p className="m-0 mt-1 text-sm text-(--on-surface-variant)">
                {[
                  order.address,
                  order.city,
                  order.state_name || order.wilaya,
                  order.country_name,
                ]
                  .filter(Boolean)
                  .join(', ')}
              </p>
              <p className="m-0 mt-1 text-sm text-(--on-surface-variant)">
                {order.customer_phone}
              </p>

              <div className="border-[color-mix(in_oklab,var(--outline-variant)_24%,transparent)] mt-8 border-t pt-8">
                <div className="flex items-center justify-between">
                  <span className="text-(--on-surface-variant) text-sm">Sous-total</span>
                  <span className="font-bold">{formatDa(Math.round(order.subtotal_cents / 100))}</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-(--on-surface-variant) text-sm">TVA</span>
                  <span className="font-bold">{formatDa(Math.round(order.tax_cents / 100))}</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-(--on-surface-variant) text-sm">Livraison</span>
                  <span className="font-bold">{formatDa(Math.round(order.shipping_cents / 100))}</span>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-secondary text-xs font-bold tracking-[0.16em] uppercase">
                    Total
                  </span>
                  <span className="text-primary text-2xl font-black">
                    {formatDa(Math.round(order.total_cents / 100))}
                  </span>
                </div>
              </div>
            </aside>
          </div>
        ) : null}
      </div>
    </main>
  )
}
