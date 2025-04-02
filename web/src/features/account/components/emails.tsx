import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useUserEmails } from '@/features/account/api/use-user-emails'
import { AddEmailForm } from '@/features/account/components/add-email-form'
import { EmailItem } from '@/features/account/components/email-item'

export const Emails = () => {
  const emails = useUserEmails()

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="text-2xl font-semibold">Email</h2>
        </CardTitle>
        <CardDescription>
          Enter the email addresses you want to use to log in with CoinControl.
          Your primary email will be used for account-related notifications.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ul className="flex flex-col gap-2">
          {emails.isPending ? (
            <>
              {Array.from({ length: 3 })
                .map((_, i) => i + 1)
                .map((i) => {
                  return (
                    <li
                      key={i}
                      className="bg-muted h-22 w-full animate-pulse rounded-lg border shadow md:h-16"></li>
                  )
                })}
            </>
          ) : (
            <>
              {emails.data?.map(({ emailID, email, isPrimary, isVerified }) => {
                return (
                  <EmailItem
                    key={emailID}
                    email={email}
                    isPrimary={isPrimary}
                    emailID={emailID}
                    isVerified={isVerified}
                  />
                )
              })}
            </>
          )}
        </ul>

        <div className="mr-auto">
          <AddEmailForm />
        </div>
      </CardContent>
    </Card>
  )
}
