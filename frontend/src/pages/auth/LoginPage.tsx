import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState } from 'react'
import authApi from '@/api/authApi'
import { useAuthStore } from '@/store/authStore'
import { useSidebarStore } from '@/store/sidebarStore'
import logoImg from '@/assets/brand/Logo.png'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { AxiosError } from 'axios'
import type { ValidationError } from '@/types'

// ─── Zod schema ───────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
})

type LoginForm = z.infer<typeof loginSchema>

// ─── Role → dashboard map ─────────────────────────────────────────────────────
function getDashboardPath(roles: string[]): string {
  if (roles.includes('Admin')) return '/admin'
  if (roles.includes('Supervisor')) return '/supervisor'
  if (roles.includes('Officer')) return '/officer'
  return '/citizen'
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const setAuth = useAuthStore((s) => s.setAuth)
  const closeSidebar = useSidebarStore((s) => s.close)

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? null

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  const { mutate: login, isPending } = useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ data }) => {
      const { user, token } = data.data
      setAuth(user, token)
      closeSidebar()
      toast.success(`Welcome back, ${user.name}!`)
      const destination = from ?? getDashboardPath(user.roles ?? [])
      navigate(destination, { replace: true })
    },
    onError: (err: AxiosError<ValidationError>) => {
      const status = err.response?.status
      if (status === 422 && err.response?.data?.errors) {
        Object.entries(err.response.data.errors).forEach(([field, messages]) => {
          setError(field as keyof LoginForm, { message: messages[0] })
        })
      } else {
        toast.error(err.response?.data?.message ?? 'Login failed. Please try again.')
      }
    },
  })

  const onSubmit = (data: LoginForm) => login(data)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted/40 via-background to-muted/40 p-4">
      <div className="w-full max-w-md">

        <Card className="rounded-2xl shadow-[0_8px_40px_-8px_rgba(0,0,0,0.18)] hover:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.25)] hover:-translate-y-1 transition-all duration-300 ease-out border border-border/20 bg-card/95 backdrop-blur-sm">

          {/* Logo + branding header */}
          <CardHeader className="pt-8 pb-6 px-8 text-center border-b border-border/40">
            <div className="flex flex-col items-center gap-2 mb-5">
              <img src={logoImg} alt="EOCO Logo" className="h-16 w-auto object-contain" />
              <div className="text-center">
                <div className="text-base font-semibold leading-tight text-foreground">Economic &amp; Organised Crime Office</div>
                <div className="text-xs text-muted-foreground leading-snug mt-0.5">Ghana — Crime Reporting Portal</div>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Welcome back</CardTitle>
            <CardDescription className="text-sm mt-1">
              Sign in to access the crime reporting portal
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 py-7">
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="h-11"
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  {...register('email')}
                />
                {errors.email && (
                  <p id="email-error" className="text-xs text-destructive flex items-center gap-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary hover:underline underline-offset-2"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="h-11 pr-10"
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full h-11 font-semibold mt-1" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6" />

            {/* Footer links */}
            <div className="space-y-3 text-center">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="font-medium text-primary hover:underline underline-offset-2">
                  Create one here
                </Link>
              </p>
              <Link
                to="/track"
                className="block text-xs text-muted-foreground hover:text-primary transition-colors underline-offset-2 hover:underline"
              >
                Track an anonymous report →
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Legal */}
        <p className="mt-5 text-center text-xs text-muted-foreground">
          Economic and Organised Crime Office — Ghana.{' '}
          <Link to="/terms" className="hover:underline hover:text-primary underline-offset-2">Terms</Link>
          {' & '}
          <Link to="/privacy" className="hover:underline hover:text-primary underline-offset-2">Privacy</Link>
        </p>
      </div>
    </div>
  )
}
