import { User } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type Props = {
  userId: string
}

export function UserAvatar({ userId }: Props) {
  return (
    <Avatar>
      <AvatarImage
        src={`https://coincontrol.maciej-garncarski/imgs/${userId}`}
      />
      <AvatarFallback>
        <User className="opacity-80" />
      </AvatarFallback>
    </Avatar>
  )
}
