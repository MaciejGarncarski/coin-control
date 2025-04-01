import { useSearch } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { useVerifySecondaryEmail } from '@/features/auth/api/use-verify-secondary-email'
import { ThemeSwitcher } from '@/features/layout/comoponents/theme-switcher'

export function VerifySecondaryEmailPage() {
  const search = useSearch({ from: '/auth/verify-email' })
  const verifyMutation = useVerifySecondaryEmail()

  const email = search.email
  const token = search.token

  if (!email) {
    return null
  }

  if (!token) {
    return null
  }

  const verifyEmail = () => {
    verifyMutation.mutate({
      email: email,
      token: token,
    })
  }

  return (
    <main className="mx-auto flex h-screen max-w-prose flex-col items-center justify-center gap-8">
      <h1 className="text-3xl font-semibold">Verify secondary email.</h1>
      <p>{search.email}</p>

      <div className="flex flex-col items-center gap-4">
        <Button type="button" className="w-full" onClick={verifyEmail}>
          Verify
        </Button>

        <ThemeSwitcher withText />
      </div>
    </main>
  )
}
