import { redirect } from 'next/navigation'

import { db } from '@/lib/db'
import { currentProfile } from '@/lib/current-profile'

import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { NavigationItem } from '@/components/navigation/navigation-item'
import { NavigationActions } from '@/components/navigation/navigation-actions'

export async function NavigationSideBar() {
  const profile = await currentProfile()

  if (!profile) return redirect('/')

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profile_id: profile.id,
        },
      },
    },
  })

  return (
    <aside
      className="flex h-full w-full flex-col items-center space-y-4
    bg-zinc-200 py-3 text-primary dark:bg-zinc-900"
    >
      <NavigationActions />
      <Separator
        className="mx-auto h-[.125rem] w-10 rounded-md bg-zinc-300
        dark:bg-zinc-700"
      />

      <ScrollArea className="w-full flex-1">
        {servers.map((server) => (
          <div key={server.id} className="mb-4">
            <NavigationItem
              id={server.id}
              imageUrl={server.imageUrl}
              name={server.name}
            />
          </div>
        ))}
      </ScrollArea>
    </aside>
  )
}
