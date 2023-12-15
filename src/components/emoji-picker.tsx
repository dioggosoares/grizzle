'use client'

import { Smile } from 'lucide-react'
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { useTheme } from 'next-themes'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface EmojiPickerProps {
  onChange: (value: string) => void
}

export function EmojiPicker({ onChange }: EmojiPickerProps) {
  const { resolvedTheme } = useTheme()

  return (
    <Popover>
      <PopoverTrigger>
        <Smile className="text-teal-500 transition hover:text-teal-600 dark:text-zinc-50 dark:hover:text-zinc-200" />
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={40}
        className="mb-16 border-none bg-transparent shadow-none drop-shadow-none"
      >
        <Picker
          theme={resolvedTheme}
          data={data}
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  )
}
