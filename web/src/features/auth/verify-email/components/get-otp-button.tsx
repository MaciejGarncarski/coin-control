import { Spinner } from '@/components/spinner'
import { Button } from '@/components/ui/button'
import { useSendOTP } from '@/features/auth/verify-email/api/use-send-otp'
import { ApiError } from '@/utils/api-error'
import { Mail } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const WAIT_TIMEOUT = 1000 * 60

export const GetOtpButton = () => {
  const [isDisabled, setIsDisabled] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { isPending, mutate, error, reset, isSuccess } = useSendOTP()

  const hasActiveOTPAlready =
    error instanceof ApiError && error.statusCode === 409

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
        Code sent, please wait for a while.
      </Button>
    )
  }

  return (
    <Button
      type="button"
      size="sm"
      variant={'default'}
      onClick={() => (hasActiveOTPAlready ? null : mutate())}
      disabled={hasActiveOTPAlready || isPending}>
      {isPending ? <Spinner /> : <Mail />}
      {isPending ? 'Sending email...' : isSuccess ? 'Resend code' : 'Send code'}
    </Button>
  )
}
