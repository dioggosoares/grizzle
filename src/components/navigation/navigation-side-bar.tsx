import { redirect } from 'next/navigation'

// import { db } from '@/lib/db'
import { currentProfile } from '@/lib/current-profile'
import { NavigationActions } from './navigation-actions'

export async function NavigationSideBar() {
  const profile = await currentProfile()

  if (!profile) return redirect('/')

  // const servers = await db.server.findMany({
  //   where: {
  //     members: {
  //       some: {
  //         profile_id: profile.id,
  //       },
  //     },
  //   },
  // })

  return (
    <aside
      className="flex h-full w-full flex-col items-center space-y-4
    bg-zinc-200 py-3 text-primary dark:bg-zinc-900"
    >
      <NavigationActions />
    </aside>
  )
}
