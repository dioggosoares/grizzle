'use client'

import * as z from 'zod'
import axios from 'axios'
import qs from 'query-string'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { useModal } from '@/hooks/use-modal-store'

import { Input } from '@/components/ui/input'
import { EmojiPicker } from '@/components/emoji-picker'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'

interface ChatInputProps {
  apiUrl: string
  query: Record<string, any>
  name: string
  type: 'conversation' | 'channel'
}

const formSchema = z.object({
  content: z.string().min(1),
})

export const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const { onOpen } = useModal()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      })

      await axios.post(url, values)

      form.reset()
      router.refresh()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <Input
                    leftIcon={
                      <button
                        type="button"
                        onClick={() => onOpen('messageFile', { apiUrl, query })}
                        className="flex h-6 w-6 items-center justify-center
                        rounded-full bg-zinc-500 p-1 transition hover:bg-zinc-600
                        dark:bg-zinc-400 dark:hover:bg-zinc-300"
                      >
                        <Plus className="text-white dark:text-zinc-800" />
                      </button>
                    }
                    positionIcon="both"
                    disabled={isLoading}
                    className="border-0 border-none px-3 text-zinc-600
                    placeholder:text-zinc-200/50 focus-visible:ring-0
                    focus-visible:ring-offset-0 dark:text-zinc-50"
                    placeholder={`Mensagem ${
                      type === 'conversation' ? name : '#' + name
                    }`}
                    {...field}
                    rightIcon={
                      <div className="flex">
                        <EmojiPicker
                          onChange={(emoji: string) =>
                            field.onChange(`${field.value} ${emoji}`)
                          }
                        />
                      </div>
                    }
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
