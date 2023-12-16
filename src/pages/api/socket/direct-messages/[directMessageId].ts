import { NextApiRequest } from 'next'
import { MemberRole } from '@prisma/client'

import { db } from '@/lib/db'
import { currentProfilePages } from '@/lib/current-profile-pages'

import { NextApiResponseServerIo } from '@/@types/server'

import { FEEDBACK_MESSAGES } from '@/constants/messages'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== 'DELETE' && req.method !== 'PATCH') {
    return res.status(405).json({ error: FEEDBACK_MESSAGES.METHOD_NOT_ALLOWED })
  }

  try {
    const profile = await currentProfilePages(req)
    const { directMessageId, conversationId } = req.query
    const { content } = req.body

    if (!profile) {
      return res.status(401).json({ error: FEEDBACK_MESSAGES.UNAUTHORIZED })
    }

    if (!conversationId) {
      return res
        .status(400)
        .json({ error: FEEDBACK_MESSAGES.CONVERSATION_ID_ERROR })
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
        .json({ error: FEEDBACK_MESSAGES.CONVERSATION_NOT_FOUND })
    }

    const member =
      conversation.memberOne.profile_id === profile.id
        ? conversation.memberOne
        : conversation.memberTwo

    if (!member) {
      return res.status(404).json({ error: FEEDBACK_MESSAGES.MEMBER_NOT_FOUND })
    }

    let directMessage = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversation_id: conversationId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    })

    if (!directMessage || directMessage.deleted) {
      return res
        .status(404)
        .json({ error: FEEDBACK_MESSAGES.MESSAGE_NOT_FOUND })
    }

    const isMessageOwner = directMessage.member_id === member.id
    const isAdmin = member.role === MemberRole.ADMIN
    const isModerator = member.role === MemberRole.MODERATOR
    const canModify = isMessageOwner || isAdmin || isModerator

    if (!canModify) {
      return res.status(401).json({ error: FEEDBACK_MESSAGES.UNAUTHORIZED })
    }

    if (req.method === 'DELETE') {
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          fileUrl: null,
          content: FEEDBACK_MESSAGES.MESSAGE_DELETED,
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      })
    }

    if (req.method === 'PATCH') {
      if (!isMessageOwner) {
        return res.status(401).json({ error: FEEDBACK_MESSAGES.UNAUTHORIZED })
      }

      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      })
    }

    const updateKey = `chat:${conversation.id}:messages:update`

    res?.socket?.server?.io?.emit(updateKey, directMessage)

    return res.status(200).json(directMessage)
  } catch (error) {
    console.log('[MESSAGE_ID]', error)
    return res.status(500).json({ error: FEEDBACK_MESSAGES.INTERNAL_ERROR })
  }
}
