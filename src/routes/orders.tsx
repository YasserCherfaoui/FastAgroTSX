import { Outlet, createFileRoute } from '@tanstack/react-router'
import { requireAuthentication } from '../lib/auth-guards'

export const Route = createFileRoute('/orders')({
  ssr: false,
  beforeLoad: () => requireAuthentication('/orders'),
  component: OrdersLayout,
})

function OrdersLayout() {
  return <Outlet />
}
