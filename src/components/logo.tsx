import Image from 'next/image'
import Link from 'next/link'

export const Logo = () => {
  return (
    <Link href="/" className="group flex items-center">
      <div
        className="mx-3 flex h-12 w-12 items-center justify-center overflow-hidden
      rounded-3xl bg-background transition-all group-hover:rounded-2xl
      group-hover:bg-teal-500 dark:bg-zinc-700"
      >
        <Image src="/logo.svg" alt="logo" width={32} height={32} />
      </div>
    </Link>
  )
}
