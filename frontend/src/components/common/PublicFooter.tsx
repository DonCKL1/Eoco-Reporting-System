import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Globe, Hash } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import logoImg from '@/assets/brand/Logo.png'

export function PublicFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-muted/30 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src={logoImg} alt="EOCO Logo" className="h-10 w-auto object-contain" />
              <div>
                <div className="font-bold text-foreground">EOCO</div>
                <div className="text-xs text-muted-foreground">Crime Reporting Portal</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              The Economic and Organised Crime Office is Ghana's premier agency dedicated to 
              investigating and prosecuting economic and organised crime.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>+233 (0) 302 XXX XXX</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>info@eoco.gov.gh</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Accra, Ghana</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Report Crime', href: '/report-crime' },
                { label: 'Anonymous Report', href: '/anonymous-report' },
                { label: 'Track Your Report', href: '/track' },
                { label: 'About EOCO', href: '/about' },
                { label: 'Contact Us', href: '/contact' },
                { label: 'FAQ', href: '/faq' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Sign In', href: '/login' },
                { label: 'Register', href: '/register' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {year} Economic and Organised Crime Office (EOCO). All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {[
              { icon: Globe, label: 'Website' },
              { icon: Hash, label: 'Social' },
            ].map(({ icon: Icon, label }) => (
              <button
                key={label}
                aria-label={label}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:text-primary hover:bg-primary/10"
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
