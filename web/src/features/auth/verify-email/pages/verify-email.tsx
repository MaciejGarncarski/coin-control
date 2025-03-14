import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { GetOtpButton } from '@/features/auth/verify-email/components/get-otp-button'
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
  FormLabel,
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

const OTPFormSchema = z.object({
  otpCode: z.string().length(6, {
    message: 'Your one-time password must be 6 characters.',
  }),
})

export const VerifyEmailPage = () => {
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
    verifyOTPMutation.mutate({
      code: data.otpCode,
    })
  }

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-4">
      <Card>
        <CardHeader>
          <CardTitle>
            <h1>Verify Email</h1>
          </CardTitle>
          <CardDescription>
            Please verify your email address to continue.
          </CardDescription>
          <GetOtpButton />
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
                  <FormItem>
                    <FormLabel>One-Time Password</FormLabel>
                    <FormControl>
                      <InputOTP
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
                    <FormDescription>
                      Please enter the one-time code sent to your email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  )
}
