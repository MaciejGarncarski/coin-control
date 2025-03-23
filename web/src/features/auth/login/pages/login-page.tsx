import { useLoginMutation } from '@/features/auth/login/api/login'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginMutationSchema, type LoginMutation } from '@shared/schemas'
import { useForm } from 'react-hook-form'
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
import { Link } from '@tanstack/react-router'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/spinner'
import { cn } from '@/lib/utils'
import { InputPassword } from '@/components/ui/input-password'
import { ThemeSwitcher } from '@/features/layout/comoponents/theme-switcher'

export const LoginPage = () => {
  const loginMutation = useLoginMutation()

  const form = useForm<LoginMutation>({
    resolver: zodResolver(loginMutationSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  return (
    <>
      <Card className="w-[20rem] md:w-[25rem]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            <div className="flex items-center justify-between gap-4">
              <p>
                Login to <span className="font-semibold">CoinControl</span> or
                register{' '}
                <Link to="/auth/register" className="text-foreground underline">
                  here
                </Link>
                .
              </p>
              <ThemeSwitcher />
            </div>
          </CardDescription>
          {loginMutation.isError && (
            <Alert variant={'destructive'} className={cn('bg-card mt-3')}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{loginMutation.error.message}</AlertDescription>
            </Alert>
          )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(({ email, password }) =>
                loginMutation.mutate({ email, password }),
              )}
              className="flex flex-col gap-6">
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
              <p className="bg-background text-muted-foreground text-sm">
                Forgot password? Click{' '}
                <Link
                  to="/auth/forgot-password"
                  className="text-foreground underline">
                  here.
                </Link>
              </p>
              <Button type="submit">
                {loginMutation.isPending ? <Spinner /> : null}
                {loginMutation.isPending ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  )
}
