import { zodResolver } from '@hookform/resolvers/zod'
import { z } from '@shared/schemas'
import { useQuery } from '@tanstack/react-query'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { MailWarning } from 'lucide-react'
import { type SubmitHandler, useForm } from 'react-hook-form'

import { LogoutButton } from '@/components/logout-button'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { Separator } from '@/components/ui/separator'
import { useVerifyOTP } from '@/features/auth/verify-email/api/use-verify-otp'
import { GetOtpButton } from '@/features/auth/verify-email/components/get-otp-button'
import { ThemeSwitcher } from '@/features/layout/comoponents/theme-switcher'
import { userQueryOptions } from '@/lib/auth'

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
    <main className="mx-auto -mt-8 flex h-screen w-[20rem] flex-col items-center justify-center gap-2 md:w-[23rem]">
      <div className="flex w-full justify-end">
        <ThemeSwitcher withText />
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center justify-center gap-2 pb-2">
              <MailWarning />
              <h1 className="text-center">Verify Email</h1>
            </div>
          </CardTitle>
          <CardDescription className="text-center">
            <div className="mx-auto flex flex-col items-center justify-center gap-3 text-pretty">
              <p className="mx-auto inline-block max-w-[80%] text-center">
                Click on the button below to send an verification code to{' '}
                <span className="font-semibold">{user.data?.email}</span>
              </p>
              <div className="flex gap-4">
                <GetOtpButton />
                <LogoutButton size="sm" variant="outline" />
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4">
              <Separator />
              <FormField
                control={form.control}
                name="otpCode"
                render={({ field }) => (
                  <FormItem className="gap-4">
                    <FormDescription className="mx-auto flex w-[80%] flex-col gap-1 text-center">
                      Please enter the code sent to your email.
                    </FormDescription>
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
                        Verify
                      </Button>
                    </div>

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
