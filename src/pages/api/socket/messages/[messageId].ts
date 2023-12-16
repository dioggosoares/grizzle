import { NextApiRequest } from 'next'
import { MemberRole } from '@prisma/client'

import { db } from '@/lib/db'
import { NextApiResponseServerIo } from '@/@types/server'
import { currentProfilePages } from '@/lib/current-profile-pages'

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
    const { messageId, serverId, channelId } = req.query
    const { content } = req.body

    if (!profile) {
      return res.status(401).json({ error: FEEDBACK_MESSAGES.UNAUTHORIZED })
    }

    if (!serverId) {
      return res.status(400).json({ error: FEEDBACK_MESSAGES.SERVER_ID_ERROR })
    }

    if (!channelId) {
      return res.status(400).json({ error: FEEDBACK_MESSAGES.CHANNEL_ID_ERROR })
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profile_id: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    })

    if (!server) {
      return res.status(404).json({ error: FEEDBACK_MESSAGES.NOT_FOUND })
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        server_id: serverId as string,
      },
    })

    if (!channel) {
      return res
        .status(404)
        .json({ error: FEEDBACK_MESSAGES.CHANNEL_NOT_FOUND })
    }

    const member = server.members.find(
      (member) => member.profile_id === profile.id,
    )

    if (!member) {
      return res.status(404).json({ error: FEEDBACK_MESSAGES.MEMBER_NOT_FOUND })
    }

    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    })

    if (!message || message.deleted) {
      return res
        .status(404)
        .json({ error: FEEDBACK_MESSAGES.MESSAGE_NOT_FOUND })
    }

    const isMessageOwner = message.member_id === member.id
    const isAdmin = member.role === MemberRole.ADMIN
    const isModerator = member.role === MemberRole.MODERATOR
    const canModify = isMessageOwner || isAdmin || isModerator

    if (!canModify) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (req.method === 'DELETE') {
      message = await db.message.update({
        where: {
          id: messageId as string,
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
        return res.status(401).json({ error: 'Unauthorized' })
      }

      message = await db.message.update({
        where: {
          id: messageId as string,
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

    const updateKey = `chat:${channelId}:messages:update`

    res?.socket?.server?.io?.emit(updateKey, message)

    return res.status(200).json(message)
  } catch (error) {
    console.log('[MESSAGE_ID]', error)
    return res.status(500).json({ error: 'Internal Error' })
  }
}
