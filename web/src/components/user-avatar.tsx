import { User } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUser } from '@/lib/auth'

export function UserAvatar() {
  const userData = useUser()

  return (
    <Avatar>
      <AvatarImage
        src={`https://api-coincontrol.maciej-garncarski.pl/avatars/${userData.data?.id}/avatar.jpg`}
      />
      <AvatarFallback>
        <User className="opacity-80" />
      </AvatarFallback>
    </Avatar>
  )
}
