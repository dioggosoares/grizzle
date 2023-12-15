import { NextResponse } from 'next/server'
import { Message } from '@prisma/client'

import { db } from '@/lib/db'
import { currentProfile } from '@/lib/current-profile'

import { FEEDBACK_MESSAGES } from '@/constants/messages'
import { CONST_VALUES } from '@/constants/general'

export async function GET(req: Request) {
  try {
    const profile = await currentProfile()
    const { searchParams } = new URL(req.url)

    const cursor = searchParams.get('cursor')
    const channelId = searchParams.get('channelId')

    if (!profile) {
      return new NextResponse(FEEDBACK_MESSAGES.UNAUTHORIZED, { status: 401 })
    }

    if (!channelId) {
      return new NextResponse(FEEDBACK_MESSAGES.CHANNEL_ID_ERROR, {
        status: 400,
      })
    }

    let messages: Message[] = []

    if (cursor) {
      messages = await db.message.findMany({
        take: CONST_VALUES.MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    } else {
      messages = await db.message.findMany({
        take: CONST_VALUES.MESSAGES_BATCH,
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    }

    let nextCursor = null

    if (messages.length === CONST_VALUES.MESSAGES_BATCH) {
      nextCursor = messages[CONST_VALUES.MESSAGES_BATCH - 1].id
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    })
  } catch (error) {
    console.log('[MESSAGES_GET]', error)
    return new NextResponse(FEEDBACK_MESSAGES.INTERNAL_ERROR, { status: 500 })
  }
}
