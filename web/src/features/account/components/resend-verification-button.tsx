import { Check } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Spinner } from '@/components/spinner'
import { Button } from '@/components/ui/button'
import { useResendSecondaryEmailVerification } from '@/features/account/api/use-resend-secondary-email-verification'

const WAIT_TIMEOUT = 1000 * 60 * 2

type Props = {
  email: string
  closeMenu: () => void
}

export function ResendEmailVerificationButton({ email, closeMenu }: Props) {
  const [isDisabled, setIsDisabled] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { isPending, mutate, error, reset } =
    useResendSecondaryEmailVerification()

  const hasActiveOTPAlready = error?.type === 'api'

  useEffect(() => {
    if (!hasActiveOTPAlready) {
      return
    }

    setIsDisabled(true)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setIsDisabled(false)
      reset()
    }, WAIT_TIMEOUT)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [hasActiveOTPAlready, reset])

  if (isDisabled) {
    return (
      <Button
        size="sm"
        className="w-full md:w-auto"
        variant={'outline'}
        type="button"
        disabled={isDisabled || isPending}>
        <Check />
        Code sent.
      </Button>
    )
  }

  const sendCode = () => {
    if (hasActiveOTPAlready) {
      return
    }

    mutate(
      {
        email: email,
      },
      {
        onSettled: () => {
          setIsDisabled(true)
          closeMenu()
        },
      },
    )
  }

  return (
    <Button
      type="button"
      size="sm"
      variant={'outline'}
      onClick={sendCode}
      className="w-full text-xs md:w-auto"
      disabled={hasActiveOTPAlready || isPending}>
      {isPending ? <Spinner /> : null}
      {isPending ? 'Sending email...' : 'Resend verification email'}
    </Button>
  )
}
