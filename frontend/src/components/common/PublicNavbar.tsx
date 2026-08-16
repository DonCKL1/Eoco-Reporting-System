import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import logoImg from '@/assets/brand/Logo.png'
import { useIsAuthenticated, useCurrentRole } from '@/store/authStore'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Report Crime', href: '/report-crime' },
  { label: 'Anonymous Report', href: '/anonymous-report' },
  { label: 'Track Report', href: '/track' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
]

function getRoleDashboardPath(role: string | null): string {
  if (!role) return '/login'
  const map: Record<string, string> = {
    Admin: '/admin',
    Supervisor: '/supervisor',
    Officer: '/officer',
    Citizen: '/citizen',
  }
  return map[role] ?? '/citizen'
}

export function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const isAuthenticated = useIsAuthenticated()
  const role = useCurrentRole()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logoImg} alt="EOCO Logo" className="h-10 w-auto object-contain" />
          <div className="hidden sm:block">
            <div className="text-sm font-bold leading-tight text-foreground">Crime Reporting Portal</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === '/'}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Button asChild size="sm">
              <Link to={getRoleDashboardPath(role)}>Dashboard</Link>
            </Button>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 pb-4 pt-2 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                end={link.href === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-primary',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            {!isAuthenticated && (
              <div className="mt-2 flex flex-col gap-2">
                <Button variant="outline" asChild>
                  <Link to="/login" onClick={() => setMobileOpen(false)}>Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/register" onClick={() => setMobileOpen(false)}>Register</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
