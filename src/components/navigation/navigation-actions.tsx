'use client'

import { Plus } from 'lucide-react'

import { ActionTooltip } from '../action-tooltip'
import { useModal } from '@/hooks/use-modal-store'

export function NavigationActions() {
  const { onOpen } = useModal()

  return (
    <div>
      <ActionTooltip side="right" align="center" label="Adicionar um servidor">
        <button
          onClick={() => onOpen('createServer')}
          className="group flex items-center"
        >
          <div
            className="mx-3 flex h-12 w-12 items-center justify-center overflow-hidden
            rounded-3xl bg-background transition-all group-hover:rounded-2xl
            group-hover:bg-teal-500 dark:bg-zinc-700"
          >
            <Plus
              className="h-6 w-6 text-teal-500
              transition group-hover:text-white"
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  )
}
