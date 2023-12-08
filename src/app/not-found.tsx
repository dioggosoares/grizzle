'use client'

import { Open_Sans } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const font = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
})

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-4">
      <Image
        src="/bear-notfound-light.svg"
        height="300"
        width="300"
        alt="Error"
        className="dark:hidden"
      />
      <Image
        src="/bear-notfound-dark.svg"
        height="300"
        width="300"
        alt="Error"
        className="hidden dark:block"
      />
      <h2 className={cn('text-xl font-medium', font.className)}>
        Ops, não encontramos nada aqui!
      </h2>
      <Button asChild>
        <Link href="/">Voltar</Link>
      </Button>
    </div>
  )
}
