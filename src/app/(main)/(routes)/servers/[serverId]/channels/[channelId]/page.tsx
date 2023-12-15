import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { db } from '@/lib/db'
import { currentProfile } from '@/lib/current-profile'

import { ChatInput } from '@/components/chat/chat-input'
import { ChatHeader } from '@/components/chat/chat-header'
import { ChatMessages } from '@/components/chat/chat-messages'

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
      <ChatMessages
        member={member}
        name={channel.name}
        chatId={channel.id}
        type="channel"
        apiUrl="/api/messages"
        socketUrl="/api/socket/messages"
        socketQuery={{
          channelId: channel.id,
          serverId: channel.server_id,
        }}
        paramKey="channelId"
        paramValue={channel.id}
      />
      <ChatInput
        name={channel.name}
        type="channel"
        apiUrl="/api/socket/messages"
        query={{
          channelId: channel.id,
          serverId: channel.server_id,
        }}
      />
    </div>
  )
}
