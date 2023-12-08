import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import { MemberRole } from '@prisma/client'

import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'

import { FEEDBACK_MESSAGES } from '@/constants/messages'

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json()
    const profile = await currentProfile()

    if (!profile) {
      return new NextResponse(FEEDBACK_MESSAGES.UNAUTHORIZED, { status: 401 })
    }

    const server = await db.server.create({
      data: {
        profile_id: profile.id,
        name,
        imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [{ name: 'general', profile_id: profile.id }],
        },
        members: {
          create: [{ profile_id: profile.id, role: MemberRole.ADMIN }],
        },
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log('[SERVERS_POST]', error)
    return new NextResponse(FEEDBACK_MESSAGES.INTERNAL_ERROR, { status: 500 })
  }
}
