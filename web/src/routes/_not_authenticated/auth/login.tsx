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
import { useLoginMutation } from '@/features/auth/login/api/login'
import { createFileRoute, Link } from '@tanstack/react-router'
import { AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginMutationSchema, type LoginMutation } from '@shared/zod-schemas'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/spinner'

export const Route = createFileRoute('/_not_authenticated/auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const loginMutation = useLoginMutation()

  const form = useForm<LoginMutation>({
    resolver: zodResolver(loginMutationSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-4">
      <Card className="w-[20rem] md:w-[25rem]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Login to <span className="font-semibold">CoinControl</span> or
            register{' '}
            <Link to="/auth/register" className="text-foreground underline">
              here
            </Link>
            .
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
                      <Input type="email" {...field} />
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
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">
                {loginMutation.isPending ? <Spinner /> : null}
                {loginMutation.isPending ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  )
}
