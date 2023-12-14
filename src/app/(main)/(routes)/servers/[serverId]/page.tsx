import { redirectToSignIn } from '@clerk/nextjs'

import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

interface ServerProps {
  params: {
    serverId: string
  }
}

export default async function Server({ params }: ServerProps) {
  const profile = await currentProfile()

  if (!profile) return redirectToSignIn()

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profile_id: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: 'Geral',
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  })

  const initialChannel = server?.channels[0]

  if (initialChannel?.name !== 'Geral') return null

  return redirect(`/servers/${params.serverId}/channels/${initialChannel?.id}`)
}
