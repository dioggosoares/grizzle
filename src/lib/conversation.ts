import { db } from '@/lib/db'

export async function getOrCreateConversation(
  memberOneId: string,
  memberTwoId: string,
) {
  let conversation =
    (await findConversation(memberOneId, memberTwoId)) ||
    (await findConversation(memberTwoId, memberOneId))

  if (!conversation) {
    conversation = await createNewConversation(memberOneId, memberTwoId)
  }

  return conversation
}

async function findConversation(memberOneId: string, memberTwoId: string) {
  try {
    return await db.conversation.findFirst({
      where: {
        AND: [{ member_one_id: memberOneId }, { member_two_id: memberTwoId }],
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
  } catch {
    return null
  }
}

async function createNewConversation(memberOneId: string, memberTwoId: string) {
  try {
    return await db.conversation.create({
      data: {
        member_one_id: memberOneId,
        member_two_id: memberTwoId,
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
  } catch {
    return null
  }
}
