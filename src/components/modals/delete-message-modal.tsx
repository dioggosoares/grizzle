'use client'

import { useState } from 'react'
import qs from 'query-string'
import axios from 'axios'

import { useModal } from '@/hooks/use-modal-store'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/spinner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export const DeleteMessageModal = () => {
  const { isOpen, onClose, type, data } = useModal()

  const isModalOpen = isOpen && type === 'deleteMessage'
  const { apiUrl, query } = data

  const [isLoading, setIsLoading] = useState(false)

  const onClick = async () => {
    try {
      setIsLoading(true)
      const url = qs.stringifyUrl({
        url: apiUrl || '',
        query,
      })

      await axios.delete(url)

      onClose()
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
            Excluir Mensagem
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Você tem certeza de que quer fazer isso? <br />
            Esta mensagem será excluída permanentemente.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex w-full items-center justify-end gap-x-3">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              Cancelar
            </Button>
            <Button
              disabled={isLoading}
              variant="primary"
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
