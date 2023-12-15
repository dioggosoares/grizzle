'use client'

import { Member, Message, Profile } from '@prisma/client'
import { ElementRef, Fragment, useRef } from 'react'
import { ServerCrash } from 'lucide-react'
import dayjs from 'dayjs'

import '@/lib/dayjs'

import { useChatQuery } from '@/hooks/use-chat-query'
import { useChatScroll } from '@/hooks/use-chat-scroll'

import { ChatWelcome } from '@/components/chat/chat-welcome'
import { ChatItem } from '@/components/chat/chat-item'
import { Spinner } from '@/components/spinner'
import { CONST_VALUES } from '@/constants/general'

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile
  }
}

interface ChatMessagesProps {
  name: string
  member: Member
  chatId: string
  apiUrl: string
  socketUrl: string
  socketQuery: Record<string, string>
  paramKey: 'channelId' | 'conversationId'
  paramValue: string
  type: 'channel' | 'conversation'
}

export function ChatMessages({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: ChatMessagesProps) {
  const queryKey = `chat:${chatId}`

  const chatRef = useRef<ElementRef<'div'>>(null)
  const bottomRef = useRef<ElementRef<'div'>>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    })
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  })

  if (status === 'loading') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <Spinner className="my-4 h-7 w-7 text-teal-500" />
        <p className="text-zinc-500 dark:text-zinc-400">
          Carregando mensagens...
        </p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <ServerCrash className="my-4 h-7 w-7 text-teal-500" />
        <p className="text-zinc-500 dark:text-zinc-400">Algo deu errado!</p>
      </div>
    )
  }

  return (
    <div ref={chatRef} className="flex flex-1 flex-col overflow-y-auto py-4">
      <div className="flex-1" />
      <ChatWelcome type={type} name={name} />
      <div className="mt-auto flex flex-col-reverse">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                key={message.id}
                id={message.id}
                currentMember={member}
                member={message.member}
                content={message.content}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                timestamp={dayjs(new Date(message.createdAt)).format(
                  CONST_VALUES.DATE_FORMAT,
                )}
                isUpdated={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
