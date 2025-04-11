import { createFileRoute } from '@tanstack/react-router'

import { getMySessionsQueryOptions } from '@/features/account/api/get-my-sessions'
import { getUserEmailsQueryOptions } from '@/features/account/api/use-user-emails'
import { AccountPage } from '@/features/account/pages/account'

export const Route = createFileRoute('/_authenticated/account')({
  loader: async ({ context }) => {
    return Promise.all([
      context.queryClient.ensureQueryData(getMySessionsQueryOptions),
      context.queryClient.ensureQueryData(getUserEmailsQueryOptions),
    ])
  },
  component: AccountPage,
})
