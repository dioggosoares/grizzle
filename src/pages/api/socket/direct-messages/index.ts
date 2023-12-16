import { NextApiRequest } from 'next'

import { db } from '@/lib/db'
import { currentProfilePages } from '@/lib/current-profile-pages'

import { NextApiResponseServerIo } from '@/@types/server'

import { FEEDBACK_MESSAGES } from '@/constants/messages'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const profile = await currentProfilePages(req)
    const { content, fileUrl } = req.body
    const { conversationId } = req.query

    if (!profile) {
      return res.status(401).json({ error: FEEDBACK_MESSAGES.UNAUTHORIZED })
    }

    if (!conversationId) {
      return res
        .status(400)
        .json({ error: FEEDBACK_MESSAGES.CONVERSATION_ID_ERROR })
    }

    if (!content) {
      return res.status(400).json({ error: FEEDBACK_MESSAGES.CONTENT_MISSING })
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profile_id: profile.id,
            },
          },
          {
            memberTwo: {
              profile_id: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    })

    if (!conversation) {
      return res
        .status(404)
        .json({ message: FEEDBACK_MESSAGES.CONVERSATION_NOT_FOUND })
    }

    const member =
      conversation.memberOne.profile_id === profile.id
        ? conversation.memberOne
        : conversation.memberTwo

    if (!member) {
      return res
        .status(404)
        .json({ message: FEEDBACK_MESSAGES.MEMBER_NOT_FOUND })
    }

    const message = await db.directMessage.create({
      data: {
        content,
        fileUrl,
        conversation_id: conversationId as string,
        member_id: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    })

    const channelKey = `chat:${conversationId}:messages`

    res?.socket?.server?.io?.emit(channelKey, message)

    return res.status(200).json(message)
  } catch (error) {
    console.log('[DIRECT_MESSAGES_POST]', error)
    return res.status(500).json({ message: FEEDBACK_MESSAGES.INTERNAL_ERROR })
  }
}
