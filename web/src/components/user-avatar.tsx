import { User } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUser } from '@/lib/auth'

export function UserAvatar() {
  const userData = useUser()

  return (
    <Avatar>
      {userData.data?.avatarURL ? (
        <AvatarImage src={userData.data?.avatarURL} />
      ) : null}
      <AvatarFallback>
        <User className="opacity-80" />
      </AvatarFallback>
    </Avatar>
  )
}
