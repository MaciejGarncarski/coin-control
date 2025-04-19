import { User } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUser } from '@/lib/auth'

export function UserAvatar() {
  const userData = useUser()

  return (
    <Avatar className="border-reflect border-0">
      {userData.data?.avatarURL ? (
        <AvatarImage src={userData.data?.avatarURL} />
      ) : null}
      <AvatarFallback className="bg-primary/10">
        <User className="opacity-80" />
      </AvatarFallback>
    </Avatar>
  )
}
