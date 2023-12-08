import { NextResponse } from 'next/server'

import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'

import { FEEDBACK_MESSAGES } from '@/constants/messages'

export async function DELETE(
  req: Request,
  { params }: { params: { serverId: string } },
) {
  try {
    const profile = await currentProfile()

    if (!profile) {
      return new NextResponse(FEEDBACK_MESSAGES.UNAUTHORIZED, { status: 401 })
    }

    const server = await db.server.delete({
      where: {
        id: params.serverId,
        profile_id: profile.id,
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log('[SERVER_ID_DELETE]', error)
    return new NextResponse(FEEDBACK_MESSAGES.INTERNAL_ERROR, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } },
) {
  try {
    const profile = await currentProfile()
    const { name, imageUrl } = await req.json()

    if (!profile) {
      return new NextResponse(FEEDBACK_MESSAGES.UNAUTHORIZED, { status: 401 })
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profile_id: profile.id,
      },
      data: {
        name,
        imageUrl,
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log('[SERVER_ID_PATCH]', error)
    return new NextResponse(FEEDBACK_MESSAGES.INTERNAL_ERROR, { status: 500 })
  }
}
