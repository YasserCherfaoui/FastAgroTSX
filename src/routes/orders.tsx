import { Outlet, createFileRoute } from '@tanstack/react-router'

/** Auth is enforced per child route (`/orders/`, `/orders/$orderId`). Guest checkout uses `/orders/success/$orderId` without login. */
export const Route = createFileRoute('/orders')({
  ssr: false,
  component: OrdersLayout,
})

function OrdersLayout() {
  return <Outlet />
}
