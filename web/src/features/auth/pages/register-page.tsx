import { zodResolver } from '@hookform/resolvers/zod'
import { type CheckedState } from '@radix-ui/react-checkbox'
import { registerMutationSchema } from '@shared/schemas'
import { Link } from '@tanstack/react-router'
import { AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Logo } from '@/components/logo'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
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
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useRegisterMutation } from '@/features/auth/api/register'
import { GoogleLoginButton } from '@/features/auth/components/google-login-button'

export function RegisterPage() {
  const [isPrivacyPolicyRead, setIsPrivacyPolicyRead] =
    useState<CheckedState>(false)

  const registerMutation = useRegisterMutation()
  const form = useForm({
    resolver: zodResolver(registerMutationSchema),
    defaultValues: {
      email: '',
      fullName: '',
      password: '',
      confirmPassword: '',
    },
  })

  const handleFormSubmit = form.handleSubmit(
    ({ email, password, confirmPassword, fullName }) => {
      if (!isPrivacyPolicyRead) {
        return
      }

      registerMutation.mutate({
        email,
        password,
        confirmPassword,
        fullName,
      })
    },
  )

  return (
    <Card className="border-reflect w-full border-0">
      <CardHeader>
        <CardTitle>
          <Logo />
        </CardTitle>
        <CardDescription>Register to CoinControl</CardDescription>
        {registerMutation.isError && (
          <Alert variant={'destructive'} className="animate-in fade-in mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {registerMutation.error.formMessage || 'Error, try again later.'}
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <Form {...form}>
          <form
            onSubmit={handleFormSubmit}
            className="flex flex-col gap-4 md:gap-6">
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
            <div className="flex items-center justify-between">
              <Label>
                <Checkbox
                  checked={isPrivacyPolicyRead}
                  onCheckedChange={setIsPrivacyPolicyRead}
                />
                <span className="text-muted-foreground">
                  I have read{' '}
                  <Link
                    to="/privacy-policy"
                    className="text-foreground underline">
                    privacy policy
                  </Link>
                  .
                </span>
              </Label>

              <Link
                to="/auth/login"
                className="text-muted-foreground text-sm underline">
                Login
              </Link>
            </div>
            <Button type="submit" disabled={!isPrivacyPolicyRead}>
              Register
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
