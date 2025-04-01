import { useSearch } from '@tanstack/react-router'

import { Spinner } from '@/components/spinner'
import { Button } from '@/components/ui/button'
import { useVerifySecondaryEmail } from '@/features/auth/api/use-verify-secondary-email'

export function VerifySecondaryEmailPage() {
  const search = useSearch({ from: '/_authenticated/auth/verify-email' })
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

  if (verifyMutation.isError) {
    return (
      <main className="mx-auto flex h-[80dvh] max-w-[40rem] flex-col items-center justify-center gap-8 px-6 text-center">
        <h1 className="text-4xl font-semibold md:text-4xl">
          Authentication Failed
        </h1>
        <p className="text-muted-foreground text-center text-balance">
          It looks like you have already clicked this link, or the link has
          expired. Please check if you have already successfully verified your
          email. If you have not, please try again with a new link.
        </p>
        <p className="text-muted-foreground text-center text-balance">
          You may close this window.
        </p>
      </main>
    )
  }

  if (verifyMutation.isSuccess) {
    return (
      <main className="mx-auto flex h-[80dvh] max-w-[40rem] flex-col items-center justify-center gap-8 px-6 text-center">
        <h1 className="text-4xl font-semibold md:text-4xl">Email verfied</h1>
        <p className="text-muted-foreground text-center text-balance">
          Your email <span className="font-bold">{email}</span> is now verified.
        </p>
        <p className="text-muted-foreground text-center text-balance">
          You may close this window.
        </p>
      </main>
    )
  }

  return (
    <main className="mx-auto flex h-[80dvh] max-w-[40rem] flex-col items-center justify-center gap-8 px-6 text-center">
      <h1 className="text-4xl font-semibold md:text-4xl">Verification</h1>
      <p className="text-muted-foreground text-center text-balance">
        To complete the verification process for your email{' '}
        <span className="font-bold">{email}</span>, please click the button
        below:
      </p>
      <Button
        type="button"
        onClick={verifyEmail}
        disabled={verifyMutation.isPending}
        className="h-12 w-[20rem] text-base">
        {verifyMutation.isPending ? <Spinner /> : null}
        Verify
      </Button>
    </main>
  )
}
