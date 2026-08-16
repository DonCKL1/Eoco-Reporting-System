import api from './axios'
import type { ApiResponse, PaginatedResponse, User } from '@/types'

export interface StoreUserPayload {
  name: string
  email: string
  phone?: string
  password: string
  password_confirmation: string
  role: string
}

export interface UpdateUserPayload {
  name?: string
  email?: string
  phone?: string
  status?: 'active' | 'suspended'
  role?: string
}

const userApi = {
  index: (params?: { page?: number; per_page?: number }) =>
    api.get<PaginatedResponse<User>>('/users', { params }),

  store: (payload: StoreUserPayload) =>
    api.post<ApiResponse<User>>('/users', payload),

  update: (id: number, payload: UpdateUserPayload) =>
    api.put<ApiResponse<User>>(`/users/${id}`, payload),

  destroy: (id: number) =>
    api.delete<ApiResponse<null>>(`/users/${id}`),
}

export default userApi
