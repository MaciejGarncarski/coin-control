import { ApiError } from '@maciekdev/fetcher'
import { Check, Mail } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Spinner } from '@/components/spinner'
import { Button } from '@/components/ui/button'
import { useSendOTP } from '@/features/auth/api/use-send-otp'

const WAIT_TIMEOUT = 1000 * 60 * 2

export const GetOtpButton = () => {
  const [isDisabled, setIsDisabled] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { isPending, mutate, error, reset } = useSendOTP()

  const hasActiveOTPAlready = error instanceof ApiError

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

    mutate(undefined, {
      onSettled: () => {
        setIsDisabled(true)
      },
    })
  }

  return (
    <Button
      type="button"
      size="sm"
      variant={'secondary'}
      onClick={sendCode}
      disabled={hasActiveOTPAlready || isPending}>
      {isPending ? <Spinner /> : <Mail />}
      {isPending ? 'Sending email...' : 'Resend code'}
    </Button>
  )
}
