'use client'

import qs from 'query-string'
import axios from 'axios'
import * as z from 'zod'
import { ReactNode, useEffect } from 'react'
import { Hash, Mic, Video } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ChannelType } from '@prisma/client'

import { FEEDBACK_MESSAGES } from '@/constants/messages'

import { Spinner } from '@/components/spinner'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useModal } from '@/hooks/use-modal-store'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: FEEDBACK_MESSAGES.CHANNEL_NAME_REQUIRED,
    })
    .refine((name) => name !== 'general', {
      message: FEEDBACK_MESSAGES.NOT_CHANNEL_GENERAL_NAME,
    }),
  type: z.nativeEnum(ChannelType),
})

export function EditChannelModal() {
  const { isOpen, onClose, type, data } = useModal()
  const router = useRouter()

  const isModalOpen = isOpen && type === 'editChannel'
  const { channel, server } = data

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: channel?.type || ChannelType.TEXT,
    },
  })

  let typeChannel: ReactNode = <></>

  useEffect(() => {
    if (channel) {
      form.setValue('name', channel.name)
      form.setValue('type', channel.type)
    }
  }, [form, channel])

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id,
        },
      })
      await axios.patch(url, values)

      form.reset()
      router.refresh()
      onClose()
    } catch (error) {
      console.log(error)
    }
  }

  switch (channel?.type || form.getValues('type')) {
    case 'TEXT':
      typeChannel = <Hash className="h-5 w-5 text-zinc-500" />
      break
    case 'AUDIO':
      typeChannel = <Mic className="h-5 w-5 text-zinc-500" />
      break
    case 'VIDEO':
      typeChannel = <Video className="h-5 w-5 text-zinc-500" />
      break
    default:
      break
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Editar Canal
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="text-xs font-bold uppercase text-zinc-500
                      dark:text-secondary/70"
                    >
                      Nome do Canal
                    </FormLabel>
                    <FormControl>
                      <Input
                        leftIcon={typeChannel}
                        positionIcon="left"
                        disabled={isLoading}
                        className="text-zinc-900 focus-visible:ring-0
                        focus-visible:ring-offset-0"
                        placeholder="Escreva o nome do canal"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo do Canal</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          className="border-0 bg-zinc-300/50 capitalize
                          text-black outline-none ring-offset-0 focus:ring-0
                          focus:ring-offset-0"
                        >
                          <SelectValue placeholder="Select a channel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ChannelType).map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="capitalize"
                          >
                            {type.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button
                variant="primary"
                disabled={isLoading}
                className="min-w-[4.5rem]"
              >
                {isLoading ? (
                  <Spinner size="lg" className="text-zinc-50" />
                ) : (
                  'Salvar'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
