import { Outlet } from 'react-router-dom'
import { AppSidebar } from '@/components/common/AppSidebar'
import { AppHeader } from '@/components/common/AppHeader'
import { CitizenMobileNav } from '@/components/common/CitizenMobileNav'
import { useSidebarStore } from '@/store/sidebarStore'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  role: 'Citizen' | 'Officer' | 'Supervisor' | 'Admin'
}

export function DashboardLayout({ role }: DashboardLayoutProps) {
  const isOpen = useSidebarStore((s) => s.isOpen)
  const toggle = useSidebarStore((s) => s.toggle)
  const isCitizen = role === 'Citizen'

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar role={role} />
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => toggle()} 
        />
      )}
      <div
        className={cn(
          'flex flex-1 flex-col overflow-hidden transition-all duration-300',
          isOpen ? 'md:ml-52' : 'md:ml-16',
          isCitizen ? 'pb-20 md:pb-0' : ''
        )}
      >
        <AppHeader role={role} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
      {isCitizen && <CitizenMobileNav />}
    </div>
  )
}
