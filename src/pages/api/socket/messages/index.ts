import { NextApiRequest } from 'next'

import { db } from '@/lib/db'
import { NextApiResponseServerIo } from '@/@types/server'
import { currentProfilePages } from '@/lib/current-profile-pages'

import { FEEDBACK_MESSAGES } from '@/constants/messages'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: FEEDBACK_MESSAGES.METHOD_NOT_ALLOWED })
  }

  try {
    const profile = await currentProfilePages(req)
    const { content, fileUrl } = req.body
    const { serverId, channelId } = req.query

    if (!profile) {
      return res.status(401).json({ error: FEEDBACK_MESSAGES.UNAUTHORIZED })
    }

    if (!serverId) {
      return res.status(400).json({ error: FEEDBACK_MESSAGES.SERVER_ID_ERROR })
    }

    if (!channelId) {
      return res.status(400).json({ error: FEEDBACK_MESSAGES.CHANNEL_ID_ERROR })
    }

    if (!content) {
      return res.status(400).json({ error: FEEDBACK_MESSAGES.CONTENT_MISSING })
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
      return res
        .status(404)
        .json({ message: FEEDBACK_MESSAGES.SERVER_NOT_FOUND })
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
        .json({ message: FEEDBACK_MESSAGES.CHANNEL_NOT_FOUND })
    }

    const member = server.members.find(
      (member) => member.profile_id === profile.id,
    )

    if (!member) {
      return res
        .status(404)
        .json({ message: FEEDBACK_MESSAGES.MEMBER_NOT_FOUND })
    }

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId: channelId as string,
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

    const channelKey = `chat:${channelId}:messages`

    res?.socket?.server?.io?.emit(channelKey, message)

    return res.status(200).json(message)
  } catch (error) {
    console.log('[MESSAGES_POST]', error)
    return res.status(500).json({ message: FEEDBACK_MESSAGES.INTERNAL_ERROR })
  }
}
