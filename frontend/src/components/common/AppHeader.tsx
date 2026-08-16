import { Bell, Menu } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { useSidebarStore } from '@/store/sidebarStore'
import { useAuthStore } from '@/store/authStore'
import { useNotificationStore } from '@/store/notificationStore'

type Role = 'Citizen' | 'Officer' | 'Supervisor' | 'Admin'

interface AppHeaderProps {
  role: Role
}

const NOTIFICATION_PATHS: Record<Role, string> = {
  Citizen: '/citizen/notifications',
  Officer: '/officer/notifications',
  Supervisor: '/supervisor/notifications',
  Admin: '/admin/notifications',
}

const PROFILE_PATHS: Record<Role, string> = {
  Citizen: '/citizen/profile',
  Officer: '/officer/profile',
  Supervisor: '/supervisor/profile',
  Admin: '/admin/settings',
}

export function AppHeader({ role }: AppHeaderProps) {
  const toggle = useSidebarStore((s) => s.toggle)
  const user = useAuthStore((s) => s.user)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const unreadCount = useNotificationStore((s) => s.unreadCount)

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '??'

  return (
    <header className="flex h-14 md:h-16 items-center justify-between border-b border-border bg-background px-4 md:px-6">
      {/* Left: hamburger + breadcrumb placeholder */}
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggle} 
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{role} Portal</span>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">

        {/* Notifications */}
        <Button variant="ghost" size="icon" asChild className="relative">
          <Link to={NOTIFICATION_PATHS[role]} aria-label="Notifications">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Link>
        </Button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{user?.name}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={PROFILE_PATHS[role]}>Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => {
                clearAuth()
                window.location.href = '/login'
              }}
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
