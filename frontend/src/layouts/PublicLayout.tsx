import { Outlet } from 'react-router-dom'
import { PublicNavbar } from '@/components/common/PublicNavbar'
import { PublicFooter } from '@/components/common/PublicFooter'
import { ScrollToTop } from '@/components/common/ScrollToTop'

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  )
}
