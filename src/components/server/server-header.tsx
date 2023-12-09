'use client'

import { MemberRole } from '@prisma/client'
import {
  ChevronDown,
  DoorOpen,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from 'lucide-react'

import { ServerWithMembersWithProfiles } from '@/@types/server'

import { useModal } from '@/hooks/use-modal-store'

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles
  role?: MemberRole
}

export function ServerHeader({ server, role }: ServerHeaderProps) {
  const { onOpen } = useModal()

  const isAdmin = role === MemberRole.ADMIN
  const isModerator = isAdmin || role === MemberRole.MODERATOR

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button
          className="text-md flex h-12 w-full items-center border-b-2
          border-zinc-200 px-3 font-semibold transition hover:bg-zinc-700/10
          dark:border-zinc-800 dark:hover:bg-zinc-700/50"
        >
          {server.name}
          <ChevronDown className="ml-auto h-5 w-5" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56 space-y-[.125rem] p-2 text-xs font-medium
        text-black dark:text-zinc-400"
      >
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen('invite', { server })}
            className="cursor-pointer px-3 py-2 text-sm text-teal-600
            focus:bg-teal-500 focus:text-white dark:text-teal-400
            dark:focus:text-white"
          >
            Convidar pessoas
            <UserPlus className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen('editServer', { server })}
            className="cursor-pointer px-3 py-2 text-sm focus:bg-teal-500
            focus:text-white dark:focus:text-white"
          >
            Configurar Servidor
            <Settings className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            className="cursor-pointer px-3 py-2 text-sm focus:bg-teal-500
            focus:text-white dark:focus:text-white"
          >
            Gerenciar Membros
            <Users className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem
            className="cursor-pointer px-3 py-2 text-sm focus:bg-teal-500
            focus:text-white dark:focus:text-white"
          >
            Criar Canal
            <PlusCircle className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem
            className="cursor-pointer px-3 py-2 text-sm text-grizzle-danger
            focus:bg-grizzle-danger focus:text-white
            dark:text-grizzle-danger-foreground focus:dark:bg-grizzle-danger-foreground
            dark:focus:text-white"
          >
            Excluir Servidor
            <Trash className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
            className="cursor-pointer px-3 py-2 text-sm text-grizzle-danger
            focus:bg-grizzle-danger focus:text-white
            dark:text-grizzle-danger-foreground focus:dark:bg-grizzle-danger-foreground
            dark:focus:text-white"
          >
            Sair do Servidor
            <DoorOpen className="ml-auto h-5 w-5" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
