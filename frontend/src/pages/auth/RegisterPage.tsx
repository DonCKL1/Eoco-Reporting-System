import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState } from 'react'
import authApi from '@/api/authApi'
import { useAuthStore } from '@/store/authStore'
import logoImg from '@/assets/brand/Logo.png'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { AxiosError } from 'axios'
import type { ValidationError } from '@/types'

// ─── Zod schema ───────────────────────────────────────────────────────────────
const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    email: z.string().email('Please enter a valid email address.'),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters.')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
      .regex(/[0-9]/, 'Password must contain at least one number.'),
    password_confirmation: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ['password_confirmation'],
    message: 'Passwords do not match.',
  })

type RegisterForm = z.infer<typeof registerSchema>

// ─── Component ────────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) })

  const { mutate: doRegister, isPending } = useMutation({
    mutationFn: authApi.register,
    onSuccess: ({ data }) => {
      const { user, roles, token } = data.data as { user: any; roles?: string[]; token: string }
      // Ensure roles are always present — registration always creates a Citizen
      const enrichedUser = {
        ...user,
        roles: user.roles ?? roles ?? ['Citizen'],
        permissions: user.permissions ?? [],
      }
      setAuth(enrichedUser, token)
      toast.success('Account created! Welcome to EOCO Portal.')
      navigate('/citizen', { replace: true })
    },
    onError: (err: AxiosError<ValidationError>) => {
      const status = err.response?.status
      if (status === 422 && err.response?.data?.errors) {
        Object.entries(err.response.data.errors).forEach(([field, messages]) => {
          setError(field as keyof RegisterForm, { message: messages[0] })
        })
      } else {
        toast.error(err.response?.data?.message ?? 'Registration failed.')
      }
    },
  })

  const onSubmit = (data: RegisterForm) => doRegister(data)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <div className="w-full max-w-md">
        {/* Header branding */}
        <div className="mb-8 text-center">
          <img src={logoImg} alt="EOCO Logo" className="inline-flex h-16 w-auto object-contain shadow-lg mb-4" />
          <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Register to report and track crimes
          </p>
        </div>

        <Card className="shadow-xl border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Register</CardTitle>
            <CardDescription>
              Create your EOCO Portal account. All information is kept strictly confidential.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="John Doe"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="reg-email">Email Address</Label>
                <Input
                  id="reg-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              {/* Phone (optional) */}
              <div className="space-y-1.5">
                <Label htmlFor="phone">
                  Phone{' '}
                  <span className="text-muted-foreground text-xs">(optional)</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+233 XX XXX XXXX"
                  {...register('phone')}
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="reg-password">Password</Label>
                <div className="relative">
                  <Input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Min. 8 characters"
                    className="pr-10"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password_confirmation">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="password_confirmation"
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Re-enter password"
                    className="pr-10"
                    {...register('password_confirmation')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showConfirm ? 'Hide' : 'Show'}
                  >
                    {showConfirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password_confirmation && (
                  <p className="text-xs text-destructive">
                    {errors.password_confirmation.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full mt-2" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account…
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By registering you agree to our{' '}
          <Link to="/terms" className="underline hover:text-primary">Terms</Link>
          {' '}and{' '}
          <Link to="/privacy" className="underline hover:text-primary">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  )
}
