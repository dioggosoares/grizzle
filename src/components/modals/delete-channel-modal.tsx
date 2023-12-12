'use client'

import axios from 'axios'
import qs from 'query-string'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useModal } from '@/hooks/use-modal-store'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/spinner'

export function DeleteChannelModal() {
  const { isOpen, onClose, type, data } = useModal()
  const router = useRouter()

  const isModalOpen = isOpen && type === 'deleteChannel'
  const { server, channel } = data

  const [isLoading, setIsLoading] = useState(false)

  const onClick = async () => {
    try {
      setIsLoading(true)
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id,
        },
      })

      await axios.delete(url)

      onClose()
      router.refresh()
      router.push(`/servers/${server?.id}`)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Excluir Canal
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Você tem certeza de que quer fazer isso? <br />
            <span className="font-semibold text-teal-500">
              #{channel?.name}
            </span>{' '}
            será excluído permanentemente.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex w-full items-center justify-end">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              Cancelar
            </Button>
            <Button
              disabled={isLoading}
              variant="danger"
              onClick={onClick}
              className="min-w-[6.1875rem] transition-opacity duration-150 ease-linear"
            >
              {isLoading ? (
                <Spinner size="lg" className="text-zinc-50" />
              ) : (
                'Confirmar'
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
