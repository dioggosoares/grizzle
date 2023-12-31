import { NextResponse } from 'next/server'

import { db } from '@/lib/db'
import { currentProfile } from '@/lib/current-profile'

import { FEEDBACK_MESSAGES } from '@/constants/messages'

export async function DELETE(
  req: Request,
  { params }: { params: { memberId: string } },
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

    if (!params.memberId) {
      return new NextResponse(FEEDBACK_MESSAGES.MEMBER_ID_ERROR, {
        status: 400,
      })
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profile_id: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            profile_id: {
              not: profile.id,
            },
          },
        },
      },
      include: {
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

    return NextResponse.json(server)
  } catch (error) {
    console.log('[MEMBER_ID_DELETE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } },
) {
  try {
    const profile = await currentProfile()
    const { searchParams } = new URL(req.url)
    const { role } = await req.json()

    const serverId = searchParams.get('serverId')

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!serverId) {
      return new NextResponse('Server ID missing', { status: 400 })
    }

    if (!params.memberId) {
      return new NextResponse('Member ID missing', { status: 400 })
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profile_id: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profile_id: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
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

    return NextResponse.json(server)
  } catch (error) {
    console.log('[MEMBERS_ID_PATCH]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
