import { redirect } from 'next/navigation'
import { redirectToSignIn } from '@clerk/nextjs'
import { ChannelType, MemberRole } from '@prisma/client'
import { Hash, Mic, ShieldCheck, ShieldHalf, Video } from 'lucide-react'

import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'

import { ServerHeader } from '@/components/server/server-header'
import { ServerSearch } from '@/components/server/server-search'
import { ServerSection } from '@/components/server/server-section'
import { ServerChannel } from '@/components/server/server-channel'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { ServerMember } from './server-member'

interface ServerSidebarProps {
  serverId: string
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldHalf className="mr-2 h-4 w-4 text-blue-600" />,
  [MemberRole.ADMIN]: (
    <ShieldCheck className="mr-2 h-4 w-4 text-grizzle-danger-foreground" />
  ),
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

  const textChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.TEXT,
  )
  const audioChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO,
  )
  const videoChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO,
  )
  const members = server.members.filter(
    (member) => member.profile_id !== profile.id,
  )

  const role = server.members.find(
    (member) => member.profile_id === profile.id,
  )?.role

  return (
    <div
      className="flex h-full w-full flex-col bg-grizzle-light-channel text-primary
      dark:bg-grizzle-dark-channel"
    >
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: 'Canais de Texto',
                type: 'channel',
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Canais de Voz',
                type: 'channel',
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Canais de Vídeo',
                type: 'channel',
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Membros',
                type: 'member',
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className="my-2 rounded-md bg-zinc-200 dark:bg-zinc-700" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
              label="Canais de Texto"
            />
            <div className="space-y-[.125rem]">
              {textChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={role}
              label="Canais de Voz"
            />
            <div className="space-y-[2px]">
              {audioChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={role}
              label="Canais de Vídeo"
            />
            <div className="space-y-[2px]">
              {videoChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!members?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              role={role}
              label="Membros"
              server={server}
            />
            <div className="space-y-[2px]">
              {members.map((member) => (
                <ServerMember key={member.id} member={member} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
