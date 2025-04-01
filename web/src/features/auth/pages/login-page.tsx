import { zodResolver } from '@hookform/resolvers/zod'
import { loginMutationSchema } from '@shared/schemas'
import { Link } from '@tanstack/react-router'
import { AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'

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
import { useLoginMutation } from '@/features/auth/api/login'
import { cn } from '@/lib/utils'

export const LoginPage = () => {
  const loginMutation = useLoginMutation()

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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Login to CoinControl</CardDescription>
        {loginMutation.isError && (
          <Alert variant={'destructive'} className={cn('bg-card mt-3')}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{loginMutation.error.message}</AlertDescription>
          </Alert>
        )}
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  )
}
