import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { db } from '@/lib/db'
import { currentProfile } from '@/lib/current-profile'
import { getOrCreateConversation } from '@/lib/conversation'
import { ChatHeader } from '@/components/chat/chat-header'

interface ConversationlProps {
  params: {
    memberId: string
    serverId: string
  }
}

export default async function Conversation({ params }: ConversationlProps) {
  const profile = await currentProfile()

  if (!profile) return redirectToSignIn()

  const currentMember = await db.member.findFirst({
    where: {
      server_id: params.serverId,
      profile_id: profile.id,
    },
    include: {
      profile: true,
    },
  })

  if (!currentMember) return redirect('/')

  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId,
  )

  if (!conversation) return redirect(`/servers/${params.serverId}`)

  const { memberOne, memberTwo } = conversation

  const otherMember =
    memberOne.profile_id === profile.id ? memberTwo : memberOne

  return (
    <div className="flex h-full flex-col bg-white dark:bg-grizzle-dark-chat">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={params.serverId}
        type="conversation"
      />
    </div>
  )
}
