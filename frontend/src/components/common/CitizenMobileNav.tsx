import { NavLink } from 'react-router-dom'
import { Home, Plus, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CitizenMobileNav() {
  return (
    <div className="md:hidden fixed bottom-3 left-4 right-4 z-50">
      <div className="bg-background/30 backdrop-blur-md border border-border/40 shadow-lg rounded-full flex items-center justify-around px-3 py-1.5 relative">
        <NavLink
          to="/citizen"
          end
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center gap-1 transition-colors p-2',
              isActive ? 'text-primary' : 'text-muted-foreground'
            )
          }
        >
          <Home className="h-4 w-4" />
        </NavLink>

        <div className="relative -top-4">
          <NavLink
            to="/citizen/reports/create"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md border-2 border-background transition-transform active:scale-95"
          >
            <Plus className="h-5 w-5" />
          </NavLink>
        </div>

        <NavLink
          to="/citizen/profile"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center gap-1 transition-colors p-2',
              isActive ? 'text-primary' : 'text-muted-foreground'
            )
          }
        >
          <User className="h-4 w-4" />
        </NavLink>
      </div>
    </div>
  )
}
