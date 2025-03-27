import { User } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'

type Props = {
  userId: string
}

export function UserAvatar({ userId }: Props) {
  return (
    <Avatar>
      <AvatarFallback>
        <User className="opacity-80" />
      </AvatarFallback>
    </Avatar>
  )
}
