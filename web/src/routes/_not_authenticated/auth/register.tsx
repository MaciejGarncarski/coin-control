import { createFileRoute } from '@tanstack/react-router'
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

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from '@tanstack/react-router'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  registerMutationSchema,
  type RegisterMutation,
} from '@shared/zod-schemas'
import { InputPassword } from '@/components/ui/input-password'
import { useRegisterMutation } from '@/features/auth/login/api/register'
import { ApiError } from '@/utils/api-error'

export const Route = createFileRoute('/_not_authenticated/auth/register')({
  component: RouteComponent,
})

function RouteComponent() {
  const registerMutation = useRegisterMutation()
  const form = useForm<RegisterMutation>({
    resolver: zodResolver(registerMutationSchema),
    defaultValues: {
      email: '',
      fullName: '',
      password: '',
      confirmPassword: '',
    },
  })

  return (
    <main className="flex h-screen items-center justify-center">
      <Card className="w-[25rem]">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>
            Register to <span className="font-semibold">CoinControl</span> or
            login{' '}
            <Link to="/auth/login" className="text-foreground underline">
              here
            </Link>
            .
          </CardDescription>
          {registerMutation.isError &&
            registerMutation.error instanceof ApiError && (
              <Alert
                variant={'destructive'}
                className="animate-in fade-in mt-3">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {registerMutation.error.toastMessage}
                </AlertDescription>
              </Alert>
            )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(
                ({ email, password, confirmPassword, fullName }) =>
                  registerMutation.mutate({
                    email,
                    password,
                    confirmPassword,
                    fullName,
                  }),
              )}
              className="flex flex-col gap-6">
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="fullName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <InputPassword {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="confirmPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <InputPassword {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Register</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  )
}
