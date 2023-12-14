import { Hash } from 'lucide-react'

import { UserAvatar } from '@/components/user-avatar'
import { MobileToggle } from '@/components/mobile-toggle'
import { SocketIndicator } from '@/components/socket-indicator'

interface ChatHeaderProps {
  serverId: string
  name: string
  type: 'channel' | 'conversation'
  imageUrl?: string
}

export function ChatHeader({
  serverId,
  name,
  type,
  imageUrl,
}: ChatHeaderProps) {
  return (
    <header
      className="text-md flex h-12 items-center border-b-2 border-zinc-200 px-3
      font-semibold dark:border-zinc-800"
    >
      <MobileToggle serverId={serverId} />
      {type === 'channel' && (
        <Hash className="mr-2 h-5 w-5 text-zinc-500 dark:text-zinc-400" />
      )}
      {type === 'conversation' && (
        <UserAvatar src={imageUrl} className="mr-2 h-7 w-7 md:h-7 md:w-7" />
      )}
      <p className="text-md font-semibold text-black dark:text-white">{name}</p>
      <div className="ml-auto flex items-center">
        <SocketIndicator />
      </div>
    </header>
  )
}
