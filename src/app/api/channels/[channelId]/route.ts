import { NextResponse } from 'next/server'
import { MemberRole } from '@prisma/client'

import { db } from '@/lib/db'
import { currentProfile } from '@/lib/current-profile'

import { FEEDBACK_MESSAGES } from '@/constants/messages'

export async function DELETE(
  req: Request,
  { params }: { params: { channelId: string } },
) {
  try {
    const profile = await currentProfile()
    const { searchParams } = new URL(req.url)

    const serverId = searchParams.get('serverId')

    if (!profile) {
      return new NextResponse(FEEDBACK_MESSAGES.UNAUTHORIZED, { status: 401 })
    }

    if (!serverId) {
      return new NextResponse(FEEDBACK_MESSAGES.SERVER_ID_ERROR, {
        status: 400,
      })
    }

    if (!params.channelId) {
      return new NextResponse(FEEDBACK_MESSAGES.CHANNEL_ID_ERROR, {
        status: 400,
      })
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profile_id: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: params.channelId,
            name: {
              not: 'general',
            },
          },
        },
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log('[CHANNEL_ID_DELETE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { channelId: string } },
) {
  try {
    const profile = await currentProfile()
    const { name, type } = await req.json()
    const { searchParams } = new URL(req.url)

    const serverId = searchParams.get('serverId')

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!serverId) {
      return new NextResponse('Server ID missing', { status: 400 })
    }

    if (!params.channelId) {
      return new NextResponse('Channel ID missing', { status: 400 })
    }

    if (name === 'general') {
      return new NextResponse("Name cannot be 'general'", { status: 400 })
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profile_id: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: params.channelId,
              NOT: {
                name: 'general',
              },
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log('[CHANNEL_ID_PATCH]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
