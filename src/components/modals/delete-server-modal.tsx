'use client'

import axios from 'axios'
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

export function DeleteServerModal() {
  const { isOpen, onClose, type, data } = useModal()
  const router = useRouter()

  const isModalOpen = isOpen && type === 'deleteServer'
  const { server } = data

  const [isLoading, setIsLoading] = useState(false)

  const handleDeleteServerConfirm = async () => {
    try {
      setIsLoading(true)

      await axios.delete(`/api/servers/${server?.id}`)

      onClose()
      router.refresh()
      router.push('/')
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
            Deletar Servidor
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Você tem certeza de que quer fazer isso? <br />
            <span className="font-semibold text-indigo-500">
              {server?.name}
            </span>{' '}
            será excluído permanentemente.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex w-full items-center justify-end gap-x-3">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              Cancelar
            </Button>
            <Button
              disabled={isLoading}
              variant="danger"
              onClick={handleDeleteServerConfirm}
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
