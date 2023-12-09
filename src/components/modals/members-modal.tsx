'use client'

import axios from 'axios'
import qs from 'query-string'
import { useState } from 'react'
import {
  Check,
  Gavel,
  MoreVertical,
  Shield,
  ShieldCheck,
  ShieldHalf,
  ShieldQuestion,
} from 'lucide-react'
import { MemberRole } from '@prisma/client'
import { useRouter } from 'next/navigation'

import { ServerWithMembersWithProfiles } from '@/@types/server'

import { useModal } from '@/hooks/use-modal-store'

import { ScrollArea } from '@/components/ui/scroll-area'
import { UserAvatar } from '@/components/user-avatar'
import { Spinner } from '@/components/spinner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { ActionTooltip } from '../action-tooltip'

const roleIconMap = {
  GUEST: <Shield className="h-4 w-4 text-zinc-600" />,
  MODERATOR: <ShieldHalf className="h-4 w-4 text-blue-600" />,
  ADMIN: <ShieldCheck className="h-4 w-4 text-grizzle-danger-foreground" />,
}

export function MembersModal() {
  const router = useRouter()
  const { onOpen, isOpen, onClose, type, data } = useModal()
  const [loadingId, setLoadingId] = useState('')

  const isModalOpen = isOpen && type === 'members'
  const { server } = data as { server: ServerWithMembersWithProfiles }

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId)
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      })

      const response = await axios.delete(url)

      router.refresh()
      onOpen('members', { server: response.data })
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingId('')
    }
  }

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId)
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      })

      const response = await axios.patch(url, { role })

      router.refresh()
      onOpen('members', { server: response.data })
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingId('')
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Gerenciar Membros
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.members?.length}{' '}
            {server?.members?.length <= 1 ? 'Membro' : 'Membros'}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[26.25rem] pr-6">
          {server?.members?.map((member) => {
            let role = ''
            switch (member.role) {
              case 'ADMIN':
                role = 'Admin'
                break
              case 'MODERATOR':
                role = 'Moderador'
                break
              case 'GUEST':
                role = 'Membro'
                break
              default:
                break
            }
            return (
              <div
                key={member.id}
                className="mb-6 flex items-center gap-x-2 pr-1"
              >
                <UserAvatar src={member.profile.imageUrl} />
                <div className="flex flex-col gap-y-1">
                  <div className="flex items-center gap-x-1 text-xs font-semibold">
                    {member.profile.name}
                    <ActionTooltip side="right" align="center" label={role}>
                      {roleIconMap[member.role]}
                    </ActionTooltip>
                  </div>
                  <p className="text-xs text-zinc-500">
                    {member.profile.email}
                  </p>
                </div>
                {server.profile_id !== member.profile_id &&
                  loadingId !== member.id && (
                    <div className="ml-auto">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreVertical className="h-4 w-4 text-zinc-500" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="left">
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="flex cursor-pointer items-center">
                              <ShieldQuestion className="mr-2 h-4 w-4" />
                              <span>Cargo</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() =>
                                    onRoleChange(member.id, 'GUEST')
                                  }
                                >
                                  <Shield className="mr-2 h-4 w-4" />
                                  Membro
                                  {member.role === 'GUEST' && (
                                    <Check className="ml-1 h-4 w-4" />
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() =>
                                    onRoleChange(member.id, 'MODERATOR')
                                  }
                                >
                                  <ShieldHalf className="mr-2 h-4 w-4" />
                                  Moderador
                                  {member.role === 'MODERATOR' && (
                                    <Check className="ml-1 h-4 w-4" />
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onKick(member.id)}
                            className="cursor-pointer"
                          >
                            <Gavel className="mr-2 h-4 w-4" />
                            Expulsar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                {loadingId === member.id && (
                  <Spinner className="ml-auto text-zinc-500" />
                )}
              </div>
            )
          })}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
