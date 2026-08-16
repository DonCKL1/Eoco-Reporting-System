import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import authApi from '@/api/authApi'
import { useAuthStore } from '@/store/authStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
})

type ProfileForm = z.infer<typeof profileSchema>

const passwordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  password: z.string().min(8, 'New password must be at least 8 characters'),
  password_confirmation: z.string().min(1, 'Please confirm your new password'),
}).refine(data => data.password === data.password_confirmation, {
  path: ['password_confirmation'],
  message: 'Passwords do not match',
})

type PasswordForm = z.infer<typeof passwordSchema>

export default function ProfilePage() {
  const { user, setUser } = useAuthStore()

  const { register: regProfile, handleSubmit: submitProfile, formState: { errors: errProfile } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '', email: user?.email || '' }
  })

  const profileMutation = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (res) => {
      toast.success('Profile updated successfully')
      setUser(res.data.data.user)
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update profile')
  })

  const onProfile = (data: ProfileForm) => profileMutation.mutate(data)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  })

  const passwordMutation = useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      toast.success('Password updated successfully')
      reset()
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update password')
    }
  })

  const onSubmitPassword = (data: PasswordForm) => passwordMutation.mutate(data)

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and security.</p>
      </div>

      <div className="grid gap-6">
        <Card className="max-md:bg-card/60 max-md:backdrop-blur-xl max-md:border-white/20 max-md:shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-md:rounded-2xl transition-all">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your profile information.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitProfile(onProfile)} className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...regProfile('name')} />
                {errProfile.name && <p className="text-xs text-destructive">{errProfile.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" {...regProfile('email')} />
                {errProfile.email && <p className="text-xs text-destructive">{errProfile.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <div className="p-2 bg-muted rounded-md text-sm capitalize">{user?.roles?.[0] || 'Unknown'}</div>
              </div>
              <Button type="submit" disabled={profileMutation.isPending}>
                {profileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Profile
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="max-md:bg-card/60 max-md:backdrop-blur-xl max-md:border-white/20 max-md:shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-md:rounded-2xl transition-all">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Ensure your account is using a long, random password to stay secure.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="current_password">Current Password</Label>
                <Input id="current_password" type="password" {...register('current_password')} />
                {errors.current_password && <p className="text-xs text-destructive">{errors.current_password.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input id="password" type="password" {...register('password')} />
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password_confirmation">Confirm Password</Label>
                <Input id="password_confirmation" type="password" {...register('password_confirmation')} />
                {errors.password_confirmation && <p className="text-xs text-destructive">{errors.password_confirmation.message}</p>}
              </div>
              <Button type="submit" disabled={passwordMutation.isPending}>
                {passwordMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
