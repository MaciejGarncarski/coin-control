import { Emails } from '@/features/account/components/emails'
import { Sessions } from '@/features/account/components/sessions'

export function AccountPage() {
  return (
    <div className="mx-auto flex max-w-[50rem] flex-col gap-16">
      <Emails />
      <Sessions />
    </div>
  )
}
