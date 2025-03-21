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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useSendPasswordResetLink } from '@/features/auth/forgot-password/api/use-send-password-reset'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  forgotPasswordEmailMutationSchema,
  type ForgotPasswordEmailMutation,
} from '@shared/zod-schemas'
import { useCanGoBack, useNavigate, useRouter } from '@tanstack/react-router'
import { LockKeyhole, Mail, MailCheck } from 'lucide-react'
import { useForm, type SubmitHandler } from 'react-hook-form'

export const ForgotPasswordPage = () => {
  const sendResetPasswordLink = useSendPasswordResetLink()
  const canGoBack = useCanGoBack()
  const navigate = useNavigate()
  const router = useRouter()

  const goBack = () => {
    if (!canGoBack) {
      navigate({
        to: '/',
      })
      return
    }

    router.history.back()
  }

  const resetMutation = () => {
    sendResetPasswordLink.reset()
  }

  const navigateToHomePage = () => {
    navigate({
      to: '/',
    })
  }

  const emailForm = useForm<ForgotPasswordEmailMutation>({
    resolver: zodResolver(forgotPasswordEmailMutationSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit: SubmitHandler<ForgotPasswordEmailMutation> = ({ email }) => {
    sendResetPasswordLink.mutate(
      {
        email: email,
      },
      {
        onSettled: () => {
          emailForm.reset({
            email: '',
          })
        },
      },
    )
  }

  if (sendResetPasswordLink.isSuccess) {
    return (
      <Card className="w-[20rem] items-center justify-center gap-2 md:w-[23rem]">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center justify-center gap-2 pb-2">
              <MailCheck />
              <h1 className="text-center">Check your email!</h1>
            </div>
          </CardTitle>
          <CardDescription className="text-center">
            <div className="mx-auto flex flex-col items-center justify-center gap-4 text-pretty">
              <p className="mx-auto inline-block max-w-[80%] text-center">
                If the email address is valid you will receive reset password
                link.
              </p>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-4 flex gap-4">
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={navigateToHomePage}>
              Done
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={resetMutation}>
              Start over
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-[20rem] items-center justify-center gap-2 md:w-[23rem]">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-center gap-2 pb-2">
            <LockKeyhole />
            <h1 className="text-center">Reset password</h1>
          </div>
        </CardTitle>
        <CardDescription className="text-center">
          <div className="mx-auto flex flex-col items-center justify-center gap-4 text-pretty">
            <p className="mx-auto inline-block max-w-[80%] text-center">
              Enter your email and we&apos;ll send you a password reset link.
            </p>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...emailForm}>
          <form
            onSubmit={emailForm.handleSubmit(onSubmit)}
            className="flex flex-col gap-4">
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem className="gap-6">
                  <div className="flex flex-col gap-2">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        placeholder="your@email.com"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                  <div className="mx-auto flex w-full items-center justify-between gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={goBack}>
                      Go back
                    </Button>

                    <Button type="submit" size="sm">
                      <Mail />
                      Send link
                    </Button>
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
