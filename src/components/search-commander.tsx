'use client'

// import { useUser } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { File } from 'lucide-react'

import { useSearch } from '@/hooks/use-search'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

export const SearchCommand = () => {
  // const { user } = useUser()
  // const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  const toggle = useSearch((store) => store.toggle)
  const isOpen = useSearch((store) => store.isOpen)
  const onClose = useSearch((store) => store.onClose)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggle()
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [toggle])

  // const onSelect = (id: string) => {
  //   router.push(`/documents/${id}`)
  //   onClose()
  // }

  if (!isMounted) {
    return null
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder={`Pesquisar no Grizzle...`} />
      <CommandList>
        <CommandEmpty>Sem resultados.</CommandEmpty>
        <CommandGroup heading="Grupos">
          <CommandItem value="grupo1" title="grupo1" onSelect={() => {}}>
            <span>Grupo</span>
          </CommandItem>
          {/* {documents?.map((document) => (
            <CommandItem
              key={document._id}
              value={`${document._id}-${document.title}`}
              title={document.title}
              onSelect={() => onSelect(document._id)}
            >
              {document.icon ? (
                <p className="mr-2 text-[18px]">{document.icon}</p>
              ) : (
                <File className="mr-2 h-4 w-4" />
              )}
              <span>{document.title}</span>
            </CommandItem>
          ))} */}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}