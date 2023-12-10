import { redirect } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'

import { db } from '@/lib/db'
import { currentProfile } from '@/lib/current-profile'

import { Logo } from '@/components/logo'
import { ModeToggle } from '@/components/mode-toggle'
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
    bg-grizzle-light-server py-3 text-primary dark:bg-grizzle-dark-server"
    >
      <Logo />
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
        <NavigationActions />
      </ScrollArea>
      <div className="mt-auto flex flex-col items-center gap-y-4 pb-3">
        <ModeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: 'h-12 w-12',
            },
          }}
        />
      </div>
    </aside>
  )
}
