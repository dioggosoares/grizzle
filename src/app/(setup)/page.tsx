import { redirect } from 'next/navigation'

import { db } from '@/lib/db'
import { initialProfile } from '@/lib/initial-profile'

import { InitialModal } from '@/components/modals/initial-modal'

export default async function Setup() {
  const profile = await initialProfile()

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profile_id: profile.id,
        },
      },
    },
  })

  if (server) {
    return redirect(`/servers/${server.id}`)
  }

  return <InitialModal />
}
