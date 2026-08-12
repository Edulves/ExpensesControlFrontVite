import { useState, type ReactNode } from 'react'
import Sidebar from './Sidebar'
import TopNavBar from './TopNavBar'
import MobileNavDrawer from './MobileNavDrawer'

interface AppShellProps {
  title: string
  subtitle?: string
  searchPlaceholder?: string
  children: ReactNode
}

export default function AppShell({
  title,
  subtitle,
  searchPlaceholder,
  children,
}: AppShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="bg-background-surface text-on-surface antialiased flex h-screen overflow-hidden">
      <Sidebar />
      <MobileNavDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <main className="flex-1 md:ml-[240px] flex flex-col h-full overflow-hidden">
        <TopNavBar
          title={title}
          subtitle={subtitle}
          searchPlaceholder={searchPlaceholder}
          onMenuClick={() => setMobileNavOpen(true)}
        />
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  )
}
