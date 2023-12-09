'use client'

import z from 'zod'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { FEEDBACK_MESSAGES } from '@/constants/messages'

import { FileUpload } from '@/components/file-upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  Form,
} from '@/components/ui/form'
import { Spinner } from '@/components/spinner'

import { useModal } from '@/hooks/use-modal-store'

const formSchema = z.object({
  name: z.string().min(1, { message: FEEDBACK_MESSAGES.SERVER_NAME_REQUIRED }),
  imageUrl: z
    .string()
    .min(1, { message: FEEDBACK_MESSAGES.SERVER_IMAGE_REQUIRED })
    .url(),
})

export function CreateServerModal() {
  const { isOpen, onClose, type } = useModal()
  const router = useRouter()

  const isModalOpen = isOpen && type === 'createServer'

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
    },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post('/api/servers', values)

      form.reset()
      router.refresh()
      onClose()
    } catch (error) {
      console.log(error)
    }
  }

  function handleClose() {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden bg-zinc-50 p-0 text-zinc-950">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl">
            Crie e customize seu servidor
          </DialogTitle>

          <DialogDescription className="text-center text-zinc-500">
            Dê ao seu servidor uma personalidade com um nome e uma imagem. Ou se
            quiser, você pode fazer isso mais tarde.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="serverImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70">
                      Nome do servidor
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="text-zinc-900 focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Escreva o nome do servidor"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button
                variant="primary"
                disabled={isLoading}
                className="min-w-[7.625rem]"
              >
                {isLoading ? (
                  <Spinner size="lg" className="text-zinc-50" />
                ) : (
                  'Criar servidor'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
