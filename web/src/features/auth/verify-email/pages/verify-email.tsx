import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { z } from '@shared/zod-schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useVerifyOTP } from '@/features/auth/verify-email/api/use-verify-otp'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { GetOtpButton } from '@/features/auth/verify-email/components/get-otp-button'
import { userQueryOptions } from '@/lib/auth'
import { useQuery } from '@tanstack/react-query'
import { MailWarning } from 'lucide-react'
import { LogoutButton } from '@/components/logout-button'

const OTPFormSchema = z.object({
  otpCode: z.string().length(6, {
    message: 'Your one-time password must be 6 characters.',
  }),
})

export const VerifyEmailPage = () => {
  const user = useQuery(userQueryOptions)
  const verifyOTPMutation = useVerifyOTP()

  const form = useForm<z.infer<typeof OTPFormSchema>>({
    resolver: zodResolver(OTPFormSchema),
    defaultValues: {
      otpCode: '',
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof OTPFormSchema>> = async (
    data,
  ) => {
    verifyOTPMutation.mutate(
      {
        code: data.otpCode,
      },
      {
        onError: () => {
          form.reset({ otpCode: '' })
        },
      },
    )
  }

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-4">
      <Card className="w-[20rem] items-center justify-center gap-4 md:w-[23rem]">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center justify-center gap-2">
              <MailWarning />
              <h1 className="text-center">Verify Email</h1>
            </div>
          </CardTitle>
          <CardDescription className="text-center">
            <p className="mx-auto flex w-[80%] flex-col gap-1">
              Please enter the one-time code sent to your email.
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="otpCode"
                render={({ field }) => (
                  <FormItem className="gap-4">
                    <FormControl>
                      <InputOTP
                        containerClassName="justify-center"
                        maxLength={6}
                        {...field}
                        pattern={REGEXP_ONLY_DIGITS}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <div className="mx-auto flex w-[50%] items-center justify-center">
                      <Button className="w-full" type="submit" size="sm">
                        Submit
                      </Button>
                    </div>
                    <FormDescription>
                      <div className="mx-auto flex flex-col items-center justify-center gap-4 text-pretty">
                        <p className="mx-auto inline-block max-w-[80%] text-center">
                          Click on the button below to send a one-time password
                          to{' '}
                          <span className="font-semibold">
                            {user.data?.email}
                          </span>
                        </p>
                        <div className="flex gap-4">
                          <GetOtpButton />
                          <LogoutButton size="sm" />
                        </div>
                      </div>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  )
}
