import { DeleteAccountForm } from '@/features/account/components/delete-account-form'
import { EditAvatarForm } from '@/features/account/components/edit-avatar-form'
import { EditNameForm } from '@/features/account/components/edit-name-form'
import { Emails } from '@/features/account/components/emails'
import { Sessions } from '@/features/account/components/sessions'

export function AccountPage() {
  return (
    <div className="mx-auto flex max-w-[50rem] flex-col gap-12">
      <EditAvatarForm />
      <EditNameForm />
      <Emails />
      <Sessions />
      <DeleteAccountForm />
    </div>
  )
}
