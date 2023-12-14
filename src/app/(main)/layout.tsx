import { NavigationSideBar } from '@/components/navigation/navigation-sidebar'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen">
      <div className="fixed inset-y-0 z-30 hidden h-full w-[4.5rem] flex-col md:flex">
        <NavigationSideBar />
      </div>
      <main className="h-full md:pl-[4.5rem]">{children}</main>
    </div>
  )
}
