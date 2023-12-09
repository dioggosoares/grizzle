import { NextResponse } from 'next/server'
import { MemberRole } from '@prisma/client'

import { db } from '@/lib/db'
import { currentProfile } from '@/lib/current-profile'

import { FEEDBACK_MESSAGES } from '@/constants/messages'

export async function POST(req: Request) {
  try {
    const profile = await currentProfile()
    const { name, type } = await req.json()
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

    if (name === 'general') {
      return new NextResponse(FEEDBACK_MESSAGES.NOT_CHANNEL_GENERAL_NAME, {
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
          create: {
            profile_id: profile.id,
            name,
            type,
          },
        },
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log('CHANNELS_POST', error)
    return new NextResponse(FEEDBACK_MESSAGES.INTERNAL_ERROR, { status: 500 })
  }
}
