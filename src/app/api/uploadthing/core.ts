import { auth } from '@clerk/nextjs'
import { createUploadthing, type FileRouter } from 'uploadthing/next'

import { FEEDBACK_MESSAGES } from '@/constants/messages'

const f = createUploadthing()

const handleAuth = () => {
  const { userId } = auth()
  if (!userId) throw new Error(FEEDBACK_MESSAGES.UNAUTHORIZED)
  return { userId }
}

export const ourFileRouter = {
  serverImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  messageFile: f(['image', 'pdf'])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
