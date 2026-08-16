import api from './axios'
import type { ApiResponse, AuthUser } from '@/types'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  phone?: string
  password: string
  password_confirmation: string
}

export interface ChangePasswordPayload {
  current_password: string
  password: string
  password_confirmation: string
}

export interface LoginResponse {
  token: string
  user: AuthUser
}

const authApi = {
  login: (payload: LoginPayload) =>
    api.post<ApiResponse<LoginResponse>>('/login', payload),

  register: (payload: RegisterPayload) =>
    api.post<ApiResponse<LoginResponse>>('/register', payload),

  logout: () => api.post<ApiResponse<null>>('/logout'),

  me: () => api.get<ApiResponse<AuthUser>>('/me'),

  changePassword: (payload: ChangePasswordPayload) =>
    api.put<ApiResponse<null>>('/change-password', payload),

  updateProfile: (payload: { name: string; email: string }) => 
    api.put<ApiResponse<{ user: AuthUser; roles: string[] }>>('/me', payload),
}

export default authApi
