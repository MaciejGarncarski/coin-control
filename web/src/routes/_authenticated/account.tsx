import { createFileRoute } from '@tanstack/react-router'

import { getMySessionsQueryOptions } from '@/features/account/api/get-my-sessions'
import { AccountPage } from '@/features/account/pages/account'

export const Route = createFileRoute('/_authenticated/account')({
  loader: async ({ context }) => {
    await context.queryClient.invalidateQueries({ queryKey: ['my-sessions'] })

    return context.queryClient.ensureQueryData(getMySessionsQueryOptions)
  },
  component: AccountPage,
  pendingComponent: () => <p>Loading</p>,
})
