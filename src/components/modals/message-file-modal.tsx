'use client'

import axios from 'axios'
import * as z from 'zod'
import qs from 'query-string'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { useModal } from '@/hooks/use-modal-store'

import { FEEDBACK_MESSAGES } from '@/constants/messages'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/file-upload'
import { Spinner } from '../spinner'

const formSchema = z.object({
  fileUrl: z.string().min(1, {
    message: FEEDBACK_MESSAGES.ATTACHMENT_REQUIRED,
  }),
})

export function MessageFileModal() {
  const { isOpen, onClose, type, data } = useModal()
  const router = useRouter()

  const isModalOpen = isOpen && type === 'messageFile'
  const { apiUrl, query } = data

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: '',
    },
  })

  const handleClose = () => {
    form.reset()
    onClose()
  }

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || '',
        query,
      })

      await axios.post(url, {
        ...values,
        content: values.fileUrl,
      })

      form.reset()
      router.refresh()
      handleClose()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Adicione um anexo
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Envio um arquivo como mensagem
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="messageFile"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button
                variant="primary"
                disabled={isLoading}
                className="min-w-[4.5625rem]"
              >
                {isLoading ? (
                  <Spinner size="lg" className="text-zinc-50" />
                ) : (
                  'Enviar'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
