'use client'

import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'

import { cn } from '@/lib/utils'

import { ActionTooltip } from '@/components/action-tooltip'

interface NavigationItemProps {
  id: string
  imageUrl: string
  name: string
}

export function NavigationItem({ id, imageUrl, name }: NavigationItemProps) {
  const params = useParams()
  const router = useRouter()

  function handleGotoServer() {
    router.push(`/servers/${id}`)
  }

  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button
        onClick={handleGotoServer}
        className="group relative flex items-center"
      >
        <div
          className={cn(
            'absolute left-0 w-1 rounded-r-full bg-primary transition-all',
            params?.serverId !== id && 'group-hover:h-5',
            params?.serverId === id ? 'h-9' : 'h-2',
          )}
        />
        <div
          className={cn(
            'rounded-3xltransition-all group relative mx-3 flex h-12 w-12 overflow-hidden',
            params?.serverId === id && 'rounded-2xl bg-primary/10 text-primary',
          )}
        >
          <Image fill src={imageUrl} alt="Canal" />
        </div>
      </button>
    </ActionTooltip>
  )
}
