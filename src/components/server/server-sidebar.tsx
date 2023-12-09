import { redirectToSignIn } from '@clerk/nextjs'
// import { ChannelType } from '@prisma/client'
import { redirect } from 'next/navigation'

import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'

import { ServerHeader } from '@/components/server/server-header'

interface ServerSidebarProps {
  serverId: string
}

export async function ServerSidebar({ serverId }: ServerSidebarProps) {
  const profile = await currentProfile()

  if (!profile) return redirectToSignIn()

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: 'asc',
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: 'asc',
        },
      },
    },
  })

  if (!server) return redirect('/')

  // const textChannels = server.channels.filter(
  //   (channel) => channel.type === ChannelType.TEXT,
  // )
  // const audioChannels = server.channels.filter(
  //   (channel) => channel.type === ChannelType.AUDIO,
  // )
  // const videoChannels = server.channels.filter(
  //   (channel) => channel.type === ChannelType.VIDEO,
  // )
  // const members = server.members.filter(
  //   (member) => member.profile_id !== profile.id,
  // )
  const role = server.members.find(
    (member) => member.profile_id === profile.id,
  )?.role

  return (
    <div
      className="flex h-full w-full flex-col bg-grizzle-light-channel text-primary
      dark:bg-grizzle-dark-channel"
    >
      <ServerHeader server={server} role={role} />
    </div>
  )
}
