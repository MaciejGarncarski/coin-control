import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useUser } from '@/lib/auth'

export const EditNameForm = () => {
  const user = useUser()

  const editNameForm = useForm({
    values: {
      name: user.data?.name,
    },
  })

  if (user.isPending) {
    return null
  }

  const updateUserFullName = editNameForm.handleSubmit(({ name }) => {
    // todo mutation
    return name
  })

  return (
    <Form {...editNameForm}>
      <form onSubmit={updateUserFullName}>
        <Card className="pb-0">
          <CardHeader>
            <CardTitle>
              <h2 className="text-2xl font-semibold">Display Name</h2>
            </CardTitle>
            <CardDescription>
              Please enter your full name, or a display name you are comfortable
              with.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={editNameForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className="max-w-[17rem]" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="bg-muted rounded-b-xl border-t px-6 py-3">
            <p className="text-muted-foreground text-sm">
              Please use 32 characters at maximum.
            </p>
            <Button type="submit" className="ml-auto" size={'sm'}>
              Save
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
