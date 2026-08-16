import { type ReactNode, useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import authApi from '@/api/authApi'
import { PageLoader } from '@/components/loaders/PageLoader'

interface ProtectedRouteProps {
  children: ReactNode
}

/**
 * ProtectedRoute — Redirects unauthenticated users to /login.
 * Preserves the attempted URL for post-login redirect.
 * If the user is authenticated but missing roles (e.g. stale session),
 * it rehydrates the session by calling /api/me.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const user = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)
  const setAuth = useAuthStore((s) => s.setAuth)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const location = useLocation()
  const [isRehydrating, setIsRehydrating] = useState(false)

  const needsRehydration = isAuthenticated && token && (!user?.roles || user.roles.length === 0)

  useEffect(() => {
    if (!needsRehydration) return

    let cancelled = false
    setIsRehydrating(true)

    authApi.me()
      .then(({ data }) => {
        if (cancelled) return
        const meData = data.data as any
        const freshUser = meData.user ?? meData
        const roles = freshUser.roles ?? meData.roles ?? []
        setAuth({ ...freshUser, roles, permissions: freshUser.permissions ?? [] }, token!)
      })
      .catch(() => {
        if (cancelled) return
        // Token is invalid — clear and redirect to login
        clearAuth()
      })
      .finally(() => {
        if (!cancelled) setIsRehydrating(false)
      })

    return () => { cancelled = true }
  }, [needsRehydration, token, setAuth, clearAuth])

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (isRehydrating) {
    return <PageLoader />
  }

  return <>{children}</>
}

interface RoleProtectedRouteProps extends ProtectedRouteProps {
  allowedRoles: string[]
}

/**
 * RoleProtectedRoute — Redirects authenticated users without the required role
 * to the /unauthorized page.
 */
export function RoleProtectedRoute({ children, allowedRoles }: RoleProtectedRouteProps) {
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const userRoles = user?.roles ?? []
  const hasAccess = allowedRoles.some((role) => userRoles.includes(role))

  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}
