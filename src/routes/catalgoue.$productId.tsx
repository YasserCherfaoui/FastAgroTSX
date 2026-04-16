import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/catalgoue/$productId')({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/products/$productId',
      params: { productId: params.productId },
      replace: true,
    })
  },
})
