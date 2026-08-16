import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Users,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  BarChart3,
  Tag,
  Activity,
  Briefcase,
  UserCog,
  Lock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSidebarStore } from '@/store/sidebarStore'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import authApi from '@/api/authApi'
import logoImg from '@/assets/brand/Logo.png'
import { confirmAction, alertSuccess } from '@/lib/confirm'

type Role = 'Citizen' | 'Officer' | 'Supervisor' | 'Admin'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const NAV_ITEMS: Record<Role, NavItem[]> = {
  Citizen: [
    { label: 'Dashboard', href: '/citizen', icon: LayoutDashboard },
    { label: 'My Reports', href: '/citizen/reports', icon: FileText },
    { label: 'Submit Report', href: '/citizen/reports/create', icon: PlusCircle },
    { label: 'Messages', href: '/citizen/messages', icon: MessageSquare },
    { label: 'Notifications', href: '/citizen/notifications', icon: Bell },
    { label: 'Profile', href: '/citizen/profile', icon: UserCog },
  ],
  Officer: [
    { label: 'Dashboard', href: '/officer', icon: LayoutDashboard },
    { label: 'Assigned Cases', href: '/officer/cases', icon: Briefcase },
    { label: 'Messages', href: '/officer/messages', icon: MessageSquare },
    { label: 'Notifications', href: '/officer/notifications', icon: Bell },
    { label: 'Profile', href: '/officer/profile', icon: UserCog },
  ],
  Supervisor: [
    { label: 'Dashboard', href: '/supervisor', icon: LayoutDashboard },
    { label: 'Assignments', href: '/supervisor/assignments', icon: ClipboardList },
    { label: 'Reports', href: '/supervisor/reports', icon: FileText },
    { label: 'Analytics', href: '/supervisor/analytics', icon: BarChart3 },
    { label: 'Notifications', href: '/supervisor/notifications', icon: Bell },
    { label: 'Profile', href: '/supervisor/profile', icon: UserCog },
  ],
  Admin: [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Roles', href: '/admin/roles', icon: Lock },
    { label: 'Categories', href: '/admin/categories', icon: Tag },
    { label: 'Reports', href: '/admin/reports', icon: FileText },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Activity Logs', href: '/admin/activity-logs', icon: Activity },
    { label: 'Wanted Persons', href: '/admin/wanted-persons', icon: Users },
    { label: 'Notifications', href: '/admin/notifications', icon: Bell },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ],
}

interface AppSidebarProps {
  role: Role
}

export function AppSidebar({ role }: AppSidebarProps) {
  const { isOpen, toggle, close } = useSidebarStore()
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const navigate = useNavigate()
  const navItems = NAV_ITEMS[role]

  /** Close sidebar on mobile after navigating */
  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      close()
    }
  }

  const handleLogout = async () => {
    const confirmed = await confirmAction('Sign Out', 'Are you sure you want to sign out?', 'Sign out');
    if (!confirmed) return;
    
    try {
      await authApi.logout()
    } finally {
      clearAuth()
      navigate('/login')
      alertSuccess('Signed Out', 'You have been successfully signed out.')
    }
  }

  return (
    <aside
      className={cn(
        'fixed left-0 bottom-0 z-40 flex flex-col border-r',
        'bg-sidebar text-sidebar-foreground border-sidebar-border',
        'transition-all duration-300 ease-in-out',
        'top-[env(safe-area-inset-top)] md:top-0',
        isOpen ? 'translate-x-0 w-52' : '-translate-x-full md:translate-x-0 md:w-16'
      )}
    >
      {/* Header */}
      <div className="flex h-14 items-center justify-between px-3 border-b border-sidebar-border">
        {isOpen ? (
          <>
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <img src={logoImg} alt="EOCO" className="h-8 w-auto object-contain flex-shrink-0" />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              className="h-8 w-8 flex-shrink-0 text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <img src={logoImg} alt="EOCO" className="hidden md:block h-8 w-auto object-contain mx-auto" />
        )}
      </div>

      {/* Collapsed toggle */}
      {!isOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="mx-auto mt-2 h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <ul className="space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => (
            <li key={href}>
              <NavLink
                to={href}
                end={href.split('/').length <= 2}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                    'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground/80',
                    !isOpen && 'justify-center px-2',
                  )
                }
                title={!isOpen ? label : undefined}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {isOpen && <span>{label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-2 pb-4">
        <Separator className="mb-4 bg-sidebar-border" />
        <button
          onClick={handleLogout}
          className={cn(
            'flex w-full items-center gap-3 rounded-md px-3 py-1.5 text-sm font-medium',
            'text-sidebar-foreground/80 transition-colors',
            'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            !isOpen && 'justify-center px-2',
          )}
          title={!isOpen ? 'Sign Out' : undefined}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {isOpen && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}
