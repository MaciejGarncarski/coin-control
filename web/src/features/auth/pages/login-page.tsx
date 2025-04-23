import { zodResolver } from '@hookform/resolvers/zod'
import { loginMutationSchema } from '@shared/schemas'
import { Link, useSearch } from '@tanstack/react-router'
import { AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { Logo } from '@/components/logo'
import { Spinner } from '@/components/spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
import { InputPassword } from '@/components/ui/input-password'
import { Separator } from '@/components/ui/separator'
import { useLoginMutation } from '@/features/auth/api/login'
import { GoogleLoginButton } from '@/features/auth/components/google-login-button'
import { cn } from '@/lib/utils'

export const LoginPage = () => {
  const loginMutation = useLoginMutation()
  const search = useSearch({ from: '/_unauthenticated/auth/login' })

  const form = useForm({
    resolver: zodResolver(loginMutationSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleLogin = form.handleSubmit(({ email, password }) => {
    loginMutation.mutate({ email, password })
  })

  return (
    <Card className="border-reflect w-full border-0">
      <CardHeader>
        <CardTitle>
          <Logo />
        </CardTitle>
        <CardDescription>Login to CoinControl</CardDescription>
        {search.error && (
          <Alert variant={'destructive'} className={cn('bg-card mt-3')}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {'Could not login. Try again later.'}
            </AlertDescription>
          </Alert>
        )}
        {loginMutation.isError && (
          <Alert variant={'destructive'} className={cn('bg-card mt-3')}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {loginMutation.error.formMessage || 'Error, try again later.'}
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <Form {...form}>
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      {...field}
                      placeholder="user@domain.com"
                    />
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
                    <InputPassword {...field} placeholder="Your password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
              <Link
                to="/auth/forgot-password"
                className="text-muted-foreground text-sm underline">
                Forgot your password?
              </Link>

              <Link
                to="/auth/register"
                className="text-muted-foreground text-sm underline">
                Register
              </Link>
            </div>
            <Button type="submit">
              {loginMutation.isPending ? <Spinner /> : null}
              {loginMutation.isPending ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Form>
        <Separator />
        <div className="flex items-center justify-stretch">
          <GoogleLoginButton />
        </div>
      </CardContent>
    </Card>
  )
}
