import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { db } from '@/lib/db'
import { currentProfile } from '@/lib/current-profile'

import { ChatHeader } from '@/components/chat/chat-header'

interface ChannelProps {
  params: {
    serverId: string
    channelId: string
  }
}

export default async function Channel({ params }: ChannelProps) {
  const profile = await currentProfile()

  if (!profile) return redirectToSignIn()

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  })

  const member = await db.member.findFirst({
    where: {
      server_id: params.serverId,
      profile_id: profile.id,
    },
  })

  if (!channel || !member) return redirect('/')

  return (
    <div className="flex h-full flex-col bg-white dark:bg-grizzle-dark-chat">
      <ChatHeader
        name={channel.name}
        serverId={channel.server_id}
        type="channel"
      />
    </div>
  )
}
