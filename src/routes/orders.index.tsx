import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { fetchMyOrders } from '../lib/api'
import { formatDa } from '../models/product'

export const Route = createFileRoute('/orders/')({
  ssr: false,
  component: OrdersIndexPage,
})

function OrdersIndexPage() {
  const ordersQuery = useQuery({
    queryKey: ['orders', 'mine'],
    queryFn: () => fetchMyOrders({ page: 1, perPage: 20 }),
  })

  return (
    <main className="bg-(--surface) min-h-screen px-6 py-12 md:py-20 lg:px-8">
      <div className="mx-auto max-w-[1100px]">
        <header className="mb-10">
          <span className="text-secondary block text-xs font-bold tracking-[0.18em] uppercase">
            Customer orders
          </span>
          <h1 className="m-0 mt-3 text-4xl font-black tracking-[-0.04em] text-(--on-surface)">
            Mes commandes
          </h1>
        </header>

        <div className="space-y-4">
          {ordersQuery.isLoading ? (
            <div className="bg-(--surface-container-low) rounded-3xl p-8 text-(--on-surface-variant)">
              Chargement des commandes...
            </div>
          ) : null}

          {ordersQuery.isError ? (
            <div className="bg-(--surface-container-low) rounded-3xl p-8 text-red-700">
              {ordersQuery.error instanceof Error
                ? ordersQuery.error.message
                : 'Impossible de charger vos commandes.'}
            </div>
          ) : null}

          {!ordersQuery.isLoading &&
          !ordersQuery.isError &&
          (ordersQuery.data?.items.length ?? 0) === 0 ? (
            <div className="bg-(--surface-container-low) rounded-3xl p-8">
              <p className="m-0 text-lg font-bold text-(--on-surface)">Aucune commande pour le moment.</p>
              <Link
                to="/catalogue"
                className="text-primary mt-4 inline-flex text-sm font-bold no-underline"
              >
                Aller au catalogue
              </Link>
            </div>
          ) : null}

          {(ordersQuery.data?.items ?? []).map((order) => (
            <Link
              key={order.id}
              to="/orders/$orderId"
              params={{ orderId: String(order.id) }}
              className="bg-(--surface-container-low) block rounded-3xl p-6 no-underline transition-colors hover:bg-(--surface-container)"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-secondary m-0 text-xs font-bold tracking-[0.16em] uppercase">
                    {order.order_number}
                  </p>
                  <p className="m-0 mt-2 text-xl font-black text-(--on-surface)">
                    {order.company_name}
                  </p>
                  <p className="text-(--on-surface-variant) m-0 mt-2 text-sm">
                    {new Date(order.created_at).toLocaleDateString('fr-FR')} | {order.status}
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-(--on-surface-variant) m-0 text-xs font-bold tracking-[0.16em] uppercase">
                    Total
                  </p>
                  <p className="text-primary m-0 mt-2 text-2xl font-black">
                    {formatDa(Math.round(order.total_cents / 100))}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
