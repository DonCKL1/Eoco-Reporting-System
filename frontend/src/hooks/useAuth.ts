import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import authApi from '@/api/authApi'
import { useAuthStore } from '@/store/authStore'
import { QUERY_KEYS } from '@/constants'

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ data }) => {
      const { user, token } = data.data
      setAuth(user, token)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.me })
      toast.success(`Welcome back, ${user.name}!`)
    },
    onError: () => {
      toast.error('Invalid email or password.')
    },
  })
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      clearAuth()
      queryClient.clear()
      window.location.href = '/login'
    },
  })
}
